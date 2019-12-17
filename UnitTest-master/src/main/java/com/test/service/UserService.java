package com.test.service;

import com.test.model.User;

public interface UserService {

	public User getUser(Integer id);

	public User saveUser(User user);

}