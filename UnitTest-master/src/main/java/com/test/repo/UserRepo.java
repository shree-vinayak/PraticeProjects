package com.test.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.test.model.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

	@Query("from User where id = :id")
	public User getUser(@Param("id") Integer id);
}
