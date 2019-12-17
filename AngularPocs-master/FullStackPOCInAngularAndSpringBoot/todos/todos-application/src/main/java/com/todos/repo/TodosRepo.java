package com.todos.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.todos.model.Todos;

@Repository
public interface TodosRepo extends JpaRepository<Todos, Integer> {

	@Query("select todos from Todos todos order by todoId desc")
	public List<Todos> findAllTodos();

}
