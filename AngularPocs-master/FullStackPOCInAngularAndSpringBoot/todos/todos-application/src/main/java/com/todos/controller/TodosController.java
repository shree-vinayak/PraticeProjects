package com.todos.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.todos.model.Todos;
import com.todos.result.ResultWrapper;
import com.todos.service.TodosService;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/todos")
public class TodosController {

	@Autowired
	private TodosService todosService;

	// To Save the Todos
	@PostMapping(path = "/saveTodos", consumes = "application/json", produces = "application/json")
	public ResponseEntity<ResultWrapper<Todos>> addTodos(@RequestBody Todos todos) {
		ResultWrapper<Todos> rw = todosService.save(todos);
		return new ResponseEntity<ResultWrapper<Todos>>(rw, HttpStatus.OK);
	}

	// To delete the Todos
	@DeleteMapping(path = "/deleteTodos/{todoId}", produces = "application/json")
	public ResponseEntity<ResultWrapper<Boolean>> deleteTodos(@PathVariable("todoId") Integer todoId) {
		ResultWrapper<Boolean> rs = todosService.delete(todoId);
		return new ResponseEntity<ResultWrapper<Boolean>>(rs, HttpStatus.OK);
	}

	// To get All the Todos
	@GetMapping(value = "/getAllTodos", produces = "application/json")
	public ResponseEntity<ResultWrapper<List<Todos>>> getAllTodos() {
		ResultWrapper<List<Todos>> rs = todosService.getAll();
		return new ResponseEntity<ResultWrapper<List<Todos>>>(rs, HttpStatus.OK);
	}

	// To Update the Todos
	@PutMapping(value = "/updateTodos", consumes = "application/json", produces = "application/json")
	public ResponseEntity<ResultWrapper<Todos>> updateFeeder11kv(@RequestBody Todos todos) {
		ResultWrapper<Todos> rs = todosService.update(todos);
		return new ResponseEntity<ResultWrapper<Todos>>(rs, HttpStatus.OK);
	}
	
	//To Delete the multiple Todos
	@PostMapping(path = "/deleteMultipleTodos", produces = "application/json")
	public ResponseEntity<ResultWrapper<Boolean>> deleteMultipleTodos(@RequestBody Map<String, List <Integer>>listOfIds) {
		ResultWrapper<Boolean> rs = todosService.deleteMultiple(listOfIds);
		return new ResponseEntity<ResultWrapper<Boolean>>(rs, HttpStatus.OK);
	}

}
