package com.test.hikari.HikariDataSource.service;

import java.util.List;

import com.test.hikari.HikariDataSource.model.Employee;

public interface EmployeeService {

	public List<Employee> getAllEmployees();

	public Employee addEmployee(Employee employee);

}
