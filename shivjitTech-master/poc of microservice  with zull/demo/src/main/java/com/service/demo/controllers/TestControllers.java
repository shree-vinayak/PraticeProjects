package com.service.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.service.demo.entity.Table1;
import com.service.demo.repository.Table1Repository;

@RestController
public class TestControllers {
	
	@Autowired
	private Table1Repository table1Repository;
	
//	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@GetMapping(path = "/testdemo")
	public String testMethod() {
		return "shubham chauhan";
	}
	
	@PostMapping(path = "/create")
	public Table1 create(@RequestBody Table1 table1) {
		table1 = table1Repository.save(table1);
		return table1;
	}
	
	
	@GetMapping(path = "/get")
	public List<Table1> getAll() {	
		return table1Repository.findAll();
	}

}
