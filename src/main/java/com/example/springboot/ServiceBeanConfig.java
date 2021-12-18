package com.example.springboot;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.springboot.repository.TodoRepository;
import com.example.springboot.service.TodoService;
import com.example.springboot.service.TodoServiceImpl;

@Configuration
public class ServiceBeanConfig {
	
	@Bean
	public TodoService todoService(TodoRepository repo) {
		return new TodoServiceImpl(repo);
	}

}
