package com.todo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.todo.repository.TodoRepository;
import com.todo.service.TodoService;
import com.todo.service.TodoServiceImpl;

@Configuration
public class ServiceBeanConfig {
	
	@Bean
	public TodoService todoService(TodoRepository repo) {
		return new TodoServiceImpl(repo);
	}

}
