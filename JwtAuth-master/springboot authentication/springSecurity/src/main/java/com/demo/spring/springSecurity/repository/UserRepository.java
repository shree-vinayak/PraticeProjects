package com.demo.spring.springSecurity.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.demo.spring.springSecurity.model.User;

@Repository
public interface UserRepository  extends CrudRepository<User, Long>{

	User findByEmailIgnoreCase(String username);

}
