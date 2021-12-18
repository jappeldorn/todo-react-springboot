package com.todo.service;

import static java.util.Optional.ofNullable;

import java.io.Serializable;
import java.util.function.Predicate;

import javax.validation.constraints.NotBlank;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import com.todo.entity.TodoEntity;


@Validated
@Transactional
public interface Service<T> {
	
	PagingAndSortingRepository<T, Serializable> getRepository();
	
	static final Predicate<? super Boolean> NOT_EXISTS = Boolean::booleanValue;
	
	static final String TODO_REQUIRED_NOT_FOUND_MESSAGE = "todo.required.not.found.message";
	
	
	/**
	 * Retrieves a single entity with the given id from the {@link PagingAndSortingRepository}
	 * 
	 * @param id
	 *            - the id of the entity to be retrieved. Cannot be blank.
	 * @return 
	 * @return - an entity matching the id or null if not found
	 */
	default T retrieve(@NotBlank(message = "{id.blank.error}") String id) {
		return getRepository().findById(id).orElse(null);
	}
	
	/**
	 * Persists the given entity in the {@link PagingAndSortingRepository}
	 * 
	 * @param created
	 *            - the entity to be created
	 * @return the created entity
	 */
	default T create(T created) {
		return getRepository().save(created);
	}
	
	
	/**
	 * Retrieves a {@link Page} of {@link TodoEntity} from the {@link PagingAndSortingRepository}.
	 * 
	 * @param pageable
	 *            - describes page, page size, and sort of the returned entities
	 * @return a page of {@link TodoEntity}
	 */
	default Page<T> retrievePage(Pageable pageable) {
		return getRepository().findAll(pageable);
	}
	
	/**
	 * 
	 * @param sort
	 * @return
	 */
	default Iterable<T> retrieveSorted(Sort sort) {
		return getRepository().findAll(sort);
	}
	
	/**
	 * Returns whether the {@link TodoEntity} with the given id exists in the {@link PagingAndSortingRepository}.
	 * 
	 * @param id
	 *            - the id to check for existence. Cannot be blank.
	 * @return whether the {@link TodoEntity} exists for a given id
	 */
	default boolean exists(@NotBlank(message = "{id.blank.error}") String id) {
		return getRepository().existsById(id);
	}
	
	/**
	 * Throws a {@link ResourceNotFoundException} if no entity exists in the {@link PagingAndSortingRepository} with the
	 * given id.
	 * 
	 * @param id
	 *            - the id to check for existence. Cannot be blank.
	 * @throws a
	 *             ResourceNotFoundException if no entity in the repository matches the given id
	 */
	default void existsRequired(@NotBlank(message = "{id.blank.error}") String id) {
		ofNullable(exists(id)).filter(NOT_EXISTS)
				.orElseThrow(() -> new MessageSourceAwareException(TODO_REQUIRED_NOT_FOUND_MESSAGE, id));
	}
	
	/**
	 * Retrieves a single entity with the given id from the {@link PagingAndSortingRepository}. Throws exception if not
	 * found.
	 * 
	 * @param id
	 *            - the id of the entity to be retrieved. Cannot be blank.
	 * @return - an entity matching the id
	 * @throws {@link
	 *             ResourceNotFoundException} if no entity in repository matches the given ID.
	 */
	default T retrieveRequired(@NotBlank(message = "{id.blank.error}") String id) {
		return ofNullable(retrieve(id))
				.orElseThrow(() -> new MessageSourceAwareException(TODO_REQUIRED_NOT_FOUND_MESSAGE, id));
	}
	
	/**
	 * Updates the entity with the given id in the {@link PagingAndSortingRepository}.
	 * 
	 * @param updated
	 *            - entity containing fields to be updated
	 * @param id
	 *            - the id of the entity to be updated. Cannot be blank.
	 */
	default T update(T updated, @NotBlank(message = "{id.blank.error}") String id) {
		existsRequired(id);
		return getRepository().save(updated);
	}

	/**
	 * Deletes the {@link TodoEntity} with the given id from the {@link PagingAndSortingRepository}.
	 * 
	 * @param id
	 *            - the id of the entity to be deleted. Cannot be blank.
	 * 
	 * @throws {@link
	 *             ResourceNotFoundException} if no entity exists matching the given id.
	 */
	default void delete(@NotBlank(message = "{id.blank.error}") String id) {
		existsRequired(id);
		getRepository().deleteById(id);
	}
	
	/**
	 * 
	 * @return	The number of entities available
	 */
	default long count() {
		return getRepository().count();
	}

}
