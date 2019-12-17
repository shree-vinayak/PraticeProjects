package com.test.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.model.Circle;

@Repository
public interface CircleRepo extends JpaRepository<Circle, Integer>{

}
