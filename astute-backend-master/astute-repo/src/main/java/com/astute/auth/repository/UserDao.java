package com.astute.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.auth.model.UserInf;

@Repository
public interface UserDao extends JpaRepository<UserInf, Integer> {

	UserInf findByUsername(String username);
}
