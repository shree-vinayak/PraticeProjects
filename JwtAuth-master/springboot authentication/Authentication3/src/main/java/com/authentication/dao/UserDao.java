package com.authentication.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.authentication.model.User;



@Repository
public interface UserDao extends JpaRepository<User, Long> {

	User findByUsername(String username);
}
