import React, { useState, useEffect } from 'react';
import Todo from './components/Todo';
import TodoForm from './components/TodoForm';
import ProgressChart from './components/ProgressChart';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const client = axios.create({
	baseURL: 'http://localhost:3000/api/todo'
})

function App() {
	const [todos, setTodos] = useState(null);

	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		refreshData();
	  }, []);

	

	const [readOnly, setReadOnly] = useState(false);

	useEffect(() => {
		setReadOnly(false)
	}, true);

	const addTodo = (item, priority) => {
		client.post('', {
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
		client.put(`/${item.id}`, {
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
		client.delete(`/${item.id}`).then(() => {
			client.get().then((response) => {
				refreshData();
			});
		})	
	};

	const refreshData = () => {
		client.get().then((response) => {
			const { data } = response;
			setTodos(data || []);
			
			client.get('/counts').then((response) => {
			  const { data } = response;
			  setChartData(getChartData(data));
			});
		});
	}

	const getChartData = (data) => {
		let chartData = [];
		if (!data.all || data.all === 0) {
			return chartData;
		} else {
			chartData.push({ name: 'All', count: data.all });
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
			<header className='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow'>
				<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="/#">My TODO Company</a>
			</header>
			<div className="container-fluid mt-4">
				<div className="row">
					<div class="col-12 col-xl-8">
						<div className="card">
							<div className="card-header">
								<h4 className="card-header-title">
									My List
								</h4>
							</div>
							<div className="card-body">						
								<div className='list-group'>
									{todos && todos.length > 0 && todos.map((todo, index) => (
										<Todo
											key={index}
											index={index}
											todo={todo}
											completeTodo={() => completeTodo(todo)}
											removeTodo={() => removeTodo(todo)}
											readOnly={readOnly}
										/>
									))}
								</div>			
								{ !readOnly ? <TodoForm addTodo={(task, priority) => addTodo(task, priority)} /> : null }
							</div>
						</div>
					</div>
					<div className="col-12 col-xl-4">
						<div className="card">
						<div className="card-header">
							<h4 className="card-header-title">
							Progress
							</h4>

						</div>
						<div className="card-body">
							<ProgressChart data={chartData}/>
						</div>
						</div>

					</div>
				</div>
			</div>			
		</div>
	);
}

export default App;