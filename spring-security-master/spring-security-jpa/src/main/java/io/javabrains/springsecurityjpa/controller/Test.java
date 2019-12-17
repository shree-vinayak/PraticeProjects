package io.javabrains.springsecurityjpa.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

	@RequestMapping("/")
	public String getHello() {
		return "Hello World";
	}
	
	@RequestMapping("/user")
	public String getUser() {
		return "Hello User";
	}
	
	@RequestMapping("/admin")
	public String getAdmin() {
		return "Hello Admin";
	}
}
