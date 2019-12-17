package com.astute.auth.service;

import java.util.List;

import com.astute.auth.dto.UserDto;
import com.astute.auth.model.UserInf;
import com.astute.results.ResultWrapper;

public interface UserService {

	ResultWrapper<UserInf> save(UserDto user);

	List<UserInf> findAll();

//	void delete(Long id);

//	User findOne(String username);

	UserInf findById(Integer id);

	ResultWrapper<UserInf> findOne(String username,String token);
}
