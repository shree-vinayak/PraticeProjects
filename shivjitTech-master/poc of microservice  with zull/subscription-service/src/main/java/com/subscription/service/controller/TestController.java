package com.subscription.service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.subscription.service.entity.TestModel;

@RestController
public class TestController {

	@Autowired
	private RestTemplate restTemplate;

//	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/test", consumes = "application/json", produces = "application/json")
	public ResponseEntity<TestModel> testMethod(@RequestBody TestModel testModel) {
		return new ResponseEntity<TestModel>(testModel, HttpStatus.OK);
	}

	@GetMapping(path = "/testp")
	public String test() {

		String s = restTemplate.getForObject("http://demo-service/testdemo/", String.class);
		return s+ "heu";
		
	}
}
