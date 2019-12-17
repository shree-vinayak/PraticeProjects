package com.todos.service;

import java.time.LocalDateTime;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.todos.model.Todos;
import com.todos.repo.TodosRepo;
import com.todos.result.Result;
import com.todos.result.ResultWrapper;

@Service
public class TodosServiceImpl implements TodosService {

	@Autowired
	private TodosRepo todosRepo;

	// Method to save the todos
	@Override
	public ResultWrapper<Todos> save(Todos todos) {
		ResultWrapper<Todos> rs = new ResultWrapper<Todos>();
		if (todos.getTitle() == null || todos.getTitle() == "") {
			rs.error(todos, "Title can not be empty");
			return rs;

		} else if (todos.getDescription() == null || todos.getDescription() == "") {
			rs.error(todos, "Description can not be empty");
			return rs;
		} 
		else {
			todos = todosRepo.save(todos);
			rs.succeedCreated(todos);
			return rs;
		}
	}

	// Method the delete the todos
	@Override
	public ResultWrapper<Boolean> delete(Integer todoId) {
		ResultWrapper<Boolean> rs = new ResultWrapper<Boolean>();
		if (todoId <= 0 || todoId == null) {
			rs.error(false, "Id Should be greater than 0 or can not be null");
		} else {
			try {
				todosRepo.deleteById(todoId);
				rs.succeedDeleted(true);

			} catch (Exception e) {
				rs.fail(false, " Exception Occurs "+e);
				return rs;
			}

		}
		return rs;

	}

	// Method to get All the todos
	@Override
	public ResultWrapper<List<Todos>> getAll() {
		ResultWrapper<List<Todos>> rs = new ResultWrapper<List<Todos>>();
		List<Todos> todosList = todosRepo.findAllTodos();
		if (todosList.size() > 0) {
			rs.succeedGet(todosList);
			return rs;
		} else {
			rs.setResult(todosList);
			rs.setStatus(Result.SUCCESS);
			rs.setMessage("List is empty");
			return rs;
		}
	}

	// Method to update the todos
	@Override
	public ResultWrapper<Todos> update(Todos todos) {
		ResultWrapper<Todos> rs = new ResultWrapper<Todos>();
		if (todos.getTodoId()<= 0 || todos.getTodoId() == null) {
			rs.error(todos, "Id Should be greater than 0 or can not be null");
			return rs;
		} else if (todos.getTitle() == null || todos.getTitle() == "") {
			rs.error(todos, "Title can not be empty");
			return rs;
		} else if (todos.getDescription() == null || todos.getDescription() == "") {
			rs.error(todos, "Description can not be empty");
			return rs;
		} else {
			todos = todosRepo.save(todos);
			rs.succeedUpdated(todos);
			return rs;
		}
	}

	// method to delete multiple todos
	@Override
	public ResultWrapper<Boolean> deleteMultiple(Map<String, List<Integer>> map) {
		ResultWrapper<Boolean> rs = new ResultWrapper<Boolean>();
		List<Integer> listofIds = map.get("deleteMultiple");
		Iterator<Integer> itr = listofIds.iterator();
		try {
			while (itr.hasNext()) {
				Integer todoId = itr.next();
				todosRepo.deleteById(todoId);
			}
			rs.succeedDeleted(true);
			return rs;
		} catch (Exception e) {
			e.printStackTrace();
			rs.fail(false, " Exception Occurs "+e);
			return rs;
		}

	}

}
