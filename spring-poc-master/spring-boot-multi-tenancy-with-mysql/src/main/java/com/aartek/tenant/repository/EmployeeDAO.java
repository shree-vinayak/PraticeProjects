package com.aartek.tenant.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.aartek.tenant.entity.Employee;

@Repository
@Transactional
public interface EmployeeDAO extends CrudRepository<Employee,Integer> {
    List<Employee> findAll();                           // fetch all Employee
}