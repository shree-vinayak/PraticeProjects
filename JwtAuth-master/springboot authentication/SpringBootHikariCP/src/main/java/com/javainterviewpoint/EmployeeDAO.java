package com.javainterviewpoint;

import java.util.List;

public interface EmployeeDAO
{
    List<Employee> getAllEmployees();
    Employee getEmployeeById(int id);
    void addEmployee(Employee employee);
    void updateEmployee(Employee employee);
    void deleteEmployee(int id);
}

