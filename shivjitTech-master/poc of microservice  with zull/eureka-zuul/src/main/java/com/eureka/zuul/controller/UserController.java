package com.eureka.zuul.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.eureka.zuul.model.UserInf;
import com.eureka.zuul.results.ResultWrapper;
import com.eureka.zuul.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class UserController {

	@Autowired
	private UserService userService;

	// This end point is user for user registration
//	@PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
	@RequestMapping(value = "/userRegistration", method = RequestMethod.POST)
	public ResponseEntity<ResultWrapper<UserInf>> saveUser(@RequestBody UserInf user) {
		ResultWrapper<UserInf> rs = userService.save(user);
		return new ResponseEntity<ResultWrapper<UserInf>>(rs, HttpStatus.OK);
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@RequestMapping(value = "/users", method = RequestMethod.GET)
	public List<UserInf> listUser() {
		System.out.println("admin users/");
		return userService.findAll();
	}

	@PreAuthorize("hasRole('ADMIN')")
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	public List<UserInf> get() {
		System.out.println(" ADMIN users");
		return userService.findAll();
	}
	
	@RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
	public UserInf getById(@PathVariable(value = "id") String id) {
		UserInf rs =  userService.findById(id);
		//return new ResponseEntity<ResultWrapper<UserInf>>(rs, HttpStatus.OK);
		return rs;
	}

}
