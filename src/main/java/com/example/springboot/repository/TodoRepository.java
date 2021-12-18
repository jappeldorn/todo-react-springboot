package com.example.springboot.repository;

import java.io.Serializable;
import java.util.Optional;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.example.springboot.entity.TodoEntity;

@Repository
public interface TodoRepository extends PagingAndSortingRepository<TodoEntity, Serializable> {
	
	Optional<Boolean> existsByItem(String item);

}
