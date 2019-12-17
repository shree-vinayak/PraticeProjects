package com.test.hikari.HikariDataSource.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.test.hikari.HikariDataSource.model.Employee;
import com.test.hikari.HikariDataSource.service.EmployeeService;

@RestController
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;
	
	
	@GetMapping("/employees")
	public ResponseEntity<List<Employee>> getAllEmployees(){
	
		List<Employee> employeeList= employeeService.getAllEmployees();
		
		return new ResponseEntity<List<Employee>>(employeeList,HttpStatus.OK);
	}
	
	
	 @PostMapping("/registerEmployee")
	    public ResponseEntity<Employee> addEmployee(@RequestBody Employee employee)
	    {
	        Employee employee1 =employeeService.addEmployee(employee);
	        return new ResponseEntity<Employee>(employee1, HttpStatus.OK);
	    }
	
	
	
}
