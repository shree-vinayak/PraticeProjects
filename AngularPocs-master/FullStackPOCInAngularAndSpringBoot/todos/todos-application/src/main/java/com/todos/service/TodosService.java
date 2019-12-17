package com.todos.service;

import java.util.List;
import java.util.Map;

import com.todos.model.Todos;
import com.todos.result.ResultWrapper;

public interface TodosService {

	public ResultWrapper<Todos> save(Todos todos);

	public ResultWrapper<Boolean> delete(Integer id);

	public ResultWrapper<List<Todos>> getAll();

	public ResultWrapper<Todos> update(Todos todos);

	public ResultWrapper<Boolean> deleteMultiple(Map<String, List<Integer>> listOfIds);

}
