package com.test.hikari.HikariDataSource.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.hikari.HikariDataSource.model.Employee;
import com.test.hikari.HikariDataSource.repository.EmployeeRepository;
import com.test.hikari.HikariDataSource.service.EmployeeService;

@Service
public class EmployeeServiceImpl  implements EmployeeService {

	
	@Autowired
	private EmployeeRepository  employeeRepository;

	@Override
	public List<Employee> getAllEmployees() {
         List<Employee> employeeList=employeeRepository.findAll();
         if(employeeList!= null)
         {
        	 return employeeList;
         }
		return null;
	}

	@Override
	public Employee addEmployee(Employee employee) {
	Employee e1=  employeeRepository.save(employee);
		
	if(e1!=null) {
		return e1;
	}
	return null;
	
	}
	
	
	
}
