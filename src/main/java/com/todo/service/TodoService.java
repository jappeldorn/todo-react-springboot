package com.todo.service;

import com.todo.entity.TodoEntity;

public interface TodoService extends Service<TodoEntity> {
	
	public long countByComplete(Boolean complete);
	
	public long countByPriority(Integer priority);

}
