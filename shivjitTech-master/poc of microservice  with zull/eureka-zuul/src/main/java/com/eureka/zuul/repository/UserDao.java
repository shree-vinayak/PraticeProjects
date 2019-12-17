package com.eureka.zuul.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eureka.zuul.model.UserInf;

@Repository
public interface UserDao extends JpaRepository<UserInf, String> {

	UserInf findByUsername(String username);
}
