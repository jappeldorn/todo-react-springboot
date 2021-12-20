import React from 'react';
import classnames from 'classnames';
import { DateTime } from 'luxon';

const Todo = ({ todo, index, completeTodo, removeTodo, readOnly, theme }) => (
	<a href='/#' className={classnames('list-group-item list-group-item-action', { 'opacity-50 text-decoration-line-through bg-light' : todo.complete }, { 'bg-dark text-white' : theme === 'dark'})}>
			<div className='d-flex w-100 justify-content-between'>
				<h5 class='mb-1'>
					<input 
						onClick={() => completeTodo(index)} 
						className={classnames('form-check-input flex-shrink-0', { 'bg-dark' : theme === 'dark' })}
						disabled={readOnly}
						type='checkbox'
						checked={todo.complete}
				    />
					<span className='p-2'>{todo.item}</span>
				</h5>
				<small>{ !readOnly 
					? <button className={classnames('btn btn-sm btn-close d-flex justify-content-end', { 'text-white' : theme === 'dark' })} onClick={() => removeTodo(index)} aria-label='Close' /> 
					: null }
				</small>
			</div>
			<p className='mb-1'>
				<small 
					className='text-muted opacity-75'>{DateTime.fromMillis(todo.updateDateTime || todo.createDateTime || '').toLocaleString(DateTime.DATETIME_FULL)}
				</small>
			</p>
					
			{ todo.priority !== 1 ? 
				<small>
					<span 
						className={classnames('badge opacity-75', { 'bg-danger': todo.priority === 2}, {'bg-info': todo.priority === 0})}>
							{todo.priority === 2 ? 'Urgent' : 'Low Priority'}
					</span>
				</small> : null }
		</a>
);

export default Todo;