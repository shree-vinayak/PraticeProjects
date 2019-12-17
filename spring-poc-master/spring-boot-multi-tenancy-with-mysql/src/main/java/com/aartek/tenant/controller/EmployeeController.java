package com.aartek.tenant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aartek.tenant.entity.Employee;
import com.aartek.tenant.repository.EmployeeDAO;

@RestController
public class EmployeeController {
	@Autowired
	private EmployeeDAO employeeDAO;

	@RequestMapping(value = "/emploeeList")
	public java.util.List<Employee> emploeeList() {
		return employeeDAO.findAll();
	}
}