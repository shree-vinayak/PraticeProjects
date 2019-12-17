package com.howtodoinjava.example.employee.api;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.test.model.Employee;

import io.swagger.annotations.ApiParam;
import io.swagger.repo.EmployeeRepo;

@javax.annotation.Generated(value = "io.swagger.codegen.languages.SpringCodegen", date = "2019-05-27T14:05:59.371+05:30")

@Controller
public class FindEmployeeDetailsApiController implements FindEmployeeDetailsApi {

    private static final Logger log = LoggerFactory.getLogger(FindEmployeeDetailsApiController.class);

	private final ObjectMapper objectMapper;

	private final HttpServletRequest request;

	@org.springframework.beans.factory.annotation.Autowired
	public FindEmployeeDetailsApiController(ObjectMapper objectMapper, HttpServletRequest request) {
		this.objectMapper = objectMapper;
		this.request = request;
	}
	
	@Autowired
	private EmployeeRepo employeeRepo;

	public ResponseEntity<Employee> getEmployeeDetails(
			@ApiParam(value = "ID of Employee to return", required = true) @PathVariable("employeeId") Long employeeId) {
		String accept = request.getHeader("Accept");
		if (accept != null && accept.contains("application/json")) {
//			try {
			Employee  e =employeeRepo.findOne(employeeId);
			System.out.println("id"+e.getFirstName());
				return new ResponseEntity<Employee>(e,HttpStatus.OK);
//				return new ResponseEntity<Employee>(objectMapper.readValue(
//						"{  \"firstName\" : \"firstName\",  \"lastName\" : \"lastName\",  \"id\" : 0}", Employee.class),
//						HttpStatus.NOT_IMPLEMENTED);
//				} 
//				catch (IOException e) {
//				log.error("Couldn't serialize response for content type application/json", e);
//				return new ResponseEntity<Employee>(HttpStatus.INTERNAL_SERVER_ERROR);
//			}
		}

		return new ResponseEntity<Employee>(HttpStatus.NOT_IMPLEMENTED);
	}
	}


