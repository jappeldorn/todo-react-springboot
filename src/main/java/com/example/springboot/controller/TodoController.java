package com.example.springboot.controller;

import static org.springframework.data.domain.Pageable.unpaged;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.status;

import javax.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.entity.TodoEntity;
import com.example.springboot.service.TodoService;

import lombok.RequiredArgsConstructor;

/**
 * Controller that takes care of all of the CRUD work for Todo item(s)
 * 
 * @author Jenny Appeldorn
 *
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/todo")
public class TodoController {
	
	private final TodoService service;
    
    @PostMapping()
    public ResponseEntity<?> postTodo(@RequestBody @Valid TodoEntity entity) {
    	service.create(entity);
    	return status(CREATED).build();
    }
	
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateTodo(@PathVariable String id, @RequestBody @Valid TodoEntity entity) {
    	service.update(entity, id);
    	return noContent().build();
    }
    
    @DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
    	service.delete(id);
		return noContent().build();
	}
    
    @GetMapping()
    public Page<TodoEntity> retrieveTodos() {    
    	return service.retrievePage(unpaged());
    }
}