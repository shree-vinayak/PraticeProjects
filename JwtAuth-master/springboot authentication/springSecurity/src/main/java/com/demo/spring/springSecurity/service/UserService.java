package com.demo.spring.springSecurity.service;

import java.util.List;

import com.demo.spring.springSecurity.model.User;

public interface UserService {

	User save(User user);

	List<User> findAll();

	User getUserByEmail(String name);

}
