import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
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
	const [theme, setTheme] = useState('light');

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

	const switchTheme = (theme) => {
		setTheme(theme);
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
		<div className={classnames('app', { 'bg-dark': theme === 'dark'})}>
			<Navigation theme={theme} user={username} />
			<div className='container-fluid mt-5'>
				<div className='row'>
					<div class='col-12 col-xl-7'>
						<div className={classnames('card', { 'bg-dark text-white border border-white' : theme === 'dark'})}>
							<div className={classnames('card-header', { 'border border-white' : theme === 'dark'})}>
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
											theme={theme}
										/>
									})}
								</div>			
								{ !readOnly ? <TodoForm theme={theme} addTodo={(task, priority) => addTodo(task, priority)} /> : null }
							</div>
						</div>
					</div>
					<div className='col-12 col-xl-5 p-0'>
						<div className={classnames('card', { 'bg-dark text-white border border-white': theme === 'dark'})}>
							<div className={classnames('card-header', { 'border border-white' : theme === 'dark'})}>
								<h4 className='card-header-title'>
								Progress
								</h4>

							</div>
							<div className='card-body'>
								<ProgressChart data={chartData} onClickChartItem={(item) => onClickChartItem(item)} theme={theme} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='row d-flex justify-content-center'>
				<div className='btn-group mt-5 col-xl-1' role='group' aria-label='Basic radio toggle button group'>
					<input onClick={() => switchTheme('dark')} type='radio' class='btn-check' name='btnradio' id='btnradio1' autocomplete='off' checked={theme === 'dark'} />
					<label className={classnames('btn', { 'btn-outline-dark' : theme === 'light'}, { 'btn-outline-light' : theme === 'dark'})} for='btnradio1'>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon" viewBox="0 0 16 16">
							<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"/>
						</svg>
					</label>

					<input onClick={() => switchTheme('light')} type='radio' class='btn-check' name='btnradio' id='btnradio2' autocomplete='off' checked={theme === 'light'} />
					<label className={classnames('btn', { 'btn-outline-dark' : theme === 'light'}, { 'btn-outline-light' : theme === 'dark'})} for='btnradio2'>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
  							<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
						</svg>
					</label>				
				</div>		
			</div>				
		</div>
	);
}

export default App;