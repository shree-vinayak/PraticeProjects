package com.test.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.test.model.User;
import com.test.repo.UserRepo;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepo  userRepo;
	
	@Override
	public User getUser(Integer id) {
		return userRepo.getUser(id);
	}

	@Override
	public User saveUser(User user) {
		
		return userRepo.save(user);
	}

	
}
