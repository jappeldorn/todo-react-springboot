import React, { useState } from 'react';
import Todo from './components/Todo';
import TodoForm from './components/TodoForm';
import ProgressChart from './components/ProgressChart';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
	const [todos, setTodos] = useState([
		{
			text: 'React Hooks in Depth',
			isCompleted: false,
			priority: 0
		},
		{
			text: 'Write Articles @ Medium',
			isCompleted: false,
			priority: 1
		},
		{
			text: 'Share article at Reddit',
			isCompleted: false,
			priority: 2
		}
	]);

	const [readOnly, setReadOnly] = useState(false);

	const [showComplete, setShowComplete] = useState(true);	

	const addTodo = text => {
		const newTodos = [...todos, { text }];
		setTodos(newTodos);
	};
	
	const completeTodo = index => {
		const newTodos = [...todos];
		newTodos[index].isCompleted = !newTodos[index].isCompleted;
		setTodos(newTodos);
	};
	
	const removeTodo = index => {
		const newTodos = [...todos];
		newTodos.splice(index, 1);
		setTodos(newTodos);
	};
	
	return (
		<div className='app'>
			<header className='navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow'>
				<a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Company name</a>
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
								{todos.map((todo, index) => (
									<Todo
										key={index}
										index={index}
										todo={todo}
										completeTodo={completeTodo}
										removeTodo={removeTodo}
										readOnly={readOnly}
									/>
								))}			
								{ !readOnly ? <TodoForm addTodo={addTodo} /> : null }
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
								<ProgressChart />
						</div>
						</div>

					</div>
				</div>
			</div>			
		</div>
	);
}

export default App;