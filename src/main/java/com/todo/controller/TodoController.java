package com.todo.controller;

import static java.lang.Boolean.TRUE;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.ResponseEntity.noContent;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.http.ResponseEntity.status;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.todo.entity.TodoEntity;
import com.todo.service.TodoService;

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
	public ResponseEntity<TodoEntity> postTodo(@RequestBody @Valid TodoEntity entity) {
		return status(CREATED).body(service.create(entity));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TodoEntity> updateTodo(@PathVariable String id, @RequestBody @Valid TodoEntity entity) {
		return ok(service.update(entity, id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
		service.delete(id);
		return noContent().build();
	}

	@GetMapping()
	public Iterable<TodoEntity> retrieveSortedTodos(@RequestParam String sortDirection) {
		return service.retrieveSorted(
				Sort.by(sortDirection.isEmpty() || sortDirection.equalsIgnoreCase("desc") ? Sort.Direction.DESC
						: Sort.Direction.ASC, "priority"));
	}

	@GetMapping("/counts")
	public Map<String, Long> retrieveCounts() {
		Map<String, Long> counts = new HashMap<>();
		long totalCount = service.count();
		counts.put("all", totalCount);
		long completedCount = service.countByComplete(TRUE);
		counts.put("complete", completedCount);
		counts.put("outstanding", totalCount - completedCount);
		counts.put("urgent", service.countByPriority(2));
		return counts;
	}
}