
package com.eureka.zuul.service;

import java.util.List;

import com.eureka.zuul.model.UserInf;
import com.eureka.zuul.results.ResultWrapper;

public interface UserService {

	ResultWrapper<UserInf> save(UserInf user);

	List<UserInf> findAll();

	UserInf findById(String id);

	ResultWrapper<UserInf> findOne(String username, String token);
}
