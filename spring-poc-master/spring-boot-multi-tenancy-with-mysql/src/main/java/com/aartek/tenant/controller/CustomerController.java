package com.aartek.tenant.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aartek.tenant.entity.Customer;
import com.aartek.tenant.repository.CustomerRepository;

@RestController
public class CustomerController {
	
	
	@Autowired
	private CustomerRepository customerRepository;

	@RequestMapping(value = "/customer")
	public java.util.List<Customer> emploeeList() {
		return customerRepository.findAll();
	}

}
