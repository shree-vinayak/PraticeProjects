package com.astute.auth.controller;

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

import com.astute.auth.dto.UserDto;
import com.astute.auth.model.UserInf;
import com.astute.auth.service.UserService;
import com.astute.results.ResultWrapper;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class UserController {

	@Autowired
	private UserService userService;

	// This end point is user for user registration
	@PreAuthorize("hasAnyRole('SUPERADMIN', 'ADMIN')")
	@RequestMapping(value = "/userRegistration", method = RequestMethod.POST)
	public ResponseEntity<ResultWrapper<UserInf>> saveUser(@RequestBody UserDto user) {
		ResultWrapper<UserInf> rs = userService.save(user);
		return new ResponseEntity<ResultWrapper<UserInf>>(rs, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@RequestMapping(value = "/users", method = RequestMethod.GET)
	public List<UserInf> listUser() {
		System.out.println("admin users/");
		return userService.findAll();
	}

//	@RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
//	public User getOne(@PathVariable(value = "id") Long id) {
//		System.out.println("usersid");
//		return userService.findById(id);
//	}

	// @Secured("ROLE_USER")
//	    @PreAuthorize("hasRole('USER')")
	@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
	@RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
	public ResponseEntity<UserInf> getOne(@PathVariable("id") Integer id) {
		System.out.println("insdie the hasRole('USER') userid" + id);
		UserInf user = userService.findById(id);
		return new ResponseEntity<UserInf>(user, HttpStatus.OK);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	public List<UserInf> get() {
		System.out.println(" ADMIN users");
		return userService.findAll();
	}

}
