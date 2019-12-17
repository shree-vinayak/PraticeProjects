package com.aartek.controller;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoggerController {

	public static final Logger LOGGER =LoggerFactory.getLogger(LoggerController.class);
	@GetMapping("/msg")
	public String print() {
		LOGGER.info("Inside print method of LoggerController");
		return "Welcome";
	}
	
}
