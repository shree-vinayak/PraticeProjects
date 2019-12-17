package com.test.hikari.HikariDataSource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.hikari.HikariDataSource.model.Employee;


@Repository
public interface EmployeeRepository  extends JpaRepository<Employee, Integer>{
	
}
