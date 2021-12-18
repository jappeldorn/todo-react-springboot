package com.todo.service;

import static java.lang.Boolean.FALSE;
import static java.time.Instant.now;
import static java.util.Optional.ofNullable;

import java.io.Serializable;
import java.util.function.Predicate;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.todo.entity.TodoEntity;
import com.todo.repository.TodoRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

	private final TodoRepository repository;

	static final String TODO_ITEM_CONFLICT_MESSAGE = "todo.item.conflict.message";

	static final Predicate<? super Boolean> EXISTS = exists -> !exists;

	@Override
	public PagingAndSortingRepository<TodoEntity, Serializable> getRepository() {
		return repository;
	}
	
	
	public long countByComplete(Boolean complete) {
		return repository.countByComplete(complete);
	}
	
	public long countByPriority(Integer priority) {
		return repository.countByPriority(priority);
	}


	@Override
	public TodoEntity create(TodoEntity entity) {
		String item = entity.item();

		repository.existsByItem(item).filter(EXISTS)
				.orElseThrow(() -> new MessageSourceAwareException(TODO_ITEM_CONFLICT_MESSAGE, item));

		Boolean complete = ofNullable(entity.complete()).orElse(FALSE);
		Integer priority = ofNullable(entity.priority()).orElse(1);

		return repository.save(entity.complete(complete).priority(priority).createDateTime(now().toEpochMilli()));
	}

	@Override
	public TodoEntity update(TodoEntity entity, String id) {
		String item = entity.item();
		
		TodoEntity currentEntity = retrieveRequired(id);
		
		if (!item.equalsIgnoreCase(currentEntity.item())) {
			repository.existsByItem(item).filter(EXISTS)
					.orElseThrow(() -> new MessageSourceAwareException(TODO_ITEM_CONFLICT_MESSAGE, item));
		}

		Boolean complete = ofNullable(entity.complete()).orElse(FALSE);
		Integer priority = ofNullable(entity.priority()).orElse(0);

		return repository.save(currentEntity.item(item).complete(complete).priority(priority)
				.updateDateTime(now().toEpochMilli()));
	}

}
