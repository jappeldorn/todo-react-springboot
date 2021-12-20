import React, { useState, useEffect } from 'react';
import Todo from './components/Todo';
import TodoForm from './components/TodoForm';
import ProgressChart from './components/ProgressChart';
import Navigation from './components/NavigationBar';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const client = axios.create({
	baseURL: '/api'
})

function App() {
	const [todos, setTodos] = useState(null);
	const [chartData, setChartData] = useState([]);
	const [chartFilter, setChartFilter] = useState(null);
	const [readOnly, setReadOnly] = useState(false);
	const [username, setUsername] = useState('User');

	useEffect(() => {
		client.get('/user').then((response) => {
			const { data } = response || {};
			const readOnly = data.authorities.filter(a => a.authority === 'ROLE_USER').length > 0;
			setReadOnly(readOnly);			
			setUsername(data.username);
		})
		refreshData();
	  }, []);

	const addTodo = (item, priority) => {
		client.post('/todo', {
			item,
			priority
     	 })
		.then((response) => {
			if (response && response.data) {
				refreshData();		
			}			
		});
	};
	
	const completeTodo = item => {
		client.put(`/todo/${item.id}`, {
			...item,
			complete: !item.complete
      })
      .then((response) => {
        if (response && response.data) {
			refreshData();
		}	
      });
	};
	
	const removeTodo = item => {
		client.delete(`/todo/${item.id}`).then(() => {
			client.get().then((response) => {
				refreshData();
			});
		})	
	};

	const refreshData = () => {
		setChartFilter(null);
		client.get('/todo').then((response) => {
			const { data } = response;
			setTodos(data || []);
			
			client.get('/todo/counts').then((response) => {
			  const { data } = response;
			  setChartData(getChartData(data));
			});
		});
	}

	const onClickChartItem = (filter) => {
		setChartFilter(filter.name);
	}

	const getChartData = (data) => {
		let chartData = [];
		if (!data.all || data.all === 0) {
			return chartData;
		}
		
		if (data.complete && data.complete > 0) {
			chartData.push({ name: 'Completed', count: data.complete });
		}

		if (data.urgent && data.urgent > 0) {
			chartData.push({ name: 'Urgent', count: data.urgent });
		}

		if (data.outstanding && data.outstanding > 0) {
			chartData.push({ name: 'Outstanding', count: data.outstanding });
		}
		return chartData;
	}
	
	return (
		<div className='app'>
			<Navigation user={username} />
			<div className='container-fluid mt-5'>
				<div className='row'>
					<div class='col-12 col-xl-7'>
						<div className='card'>
							<div className='card-header'>
								<h4 className='card-header-title'>
									My List
								</h4>
							</div>
							<div className='card-body'>						
								<div className='list-group'>
									{todos && todos.length > 0 && todos.map((todo, index) => {
										if ( chartFilter 
											&& (( chartFilter === 'Completed' && !todo.complete ) 
											|| ( chartFilter === 'Outstanding' && !!todo.complete )
											|| ( chartFilter === 'Urgent' && todo.priority !== 2))) {
											return null;
										}
										return <Todo
											key={index}
											index={index}
											todo={todo}
											completeTodo={() => completeTodo(todo)}
											removeTodo={() => removeTodo(todo)}
											readOnly={readOnly}
										/>
									})}
								</div>			
								{ !readOnly ? <TodoForm addTodo={(task, priority) => addTodo(task, priority)} /> : null }
							</div>
						</div>
					</div>
					<div className='col-12 col-xl-5 p-0'>
						<div className='card'>
							<div className='card-header'>
								<h4 className='card-header-title'>
								Progress
								</h4>

							</div>
							<div className='card-body'>
								<ProgressChart data={chartData} onClickChartItem={(item) => onClickChartItem(item)} />
							</div>
						</div>
					</div>
				</div>
			</div>			
		</div>
	);
}

export default App;