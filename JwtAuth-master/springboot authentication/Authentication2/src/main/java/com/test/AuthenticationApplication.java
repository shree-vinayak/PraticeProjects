package com.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthenticationApplication {

	public static void main(String[] args) {
		System.out.println("inside the main method");
		SpringApplication.run(AuthenticationApplication.class, args);
	}

}
