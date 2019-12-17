package com.aartek.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BaseController {

	public static final Logger LOGGER =LoggerFactory.getLogger(BaseController.class);
	@GetMapping("/hii")
	public String print() {
		LOGGER.info("Inside print method of BaseController");
		return "hii";
	}
}
