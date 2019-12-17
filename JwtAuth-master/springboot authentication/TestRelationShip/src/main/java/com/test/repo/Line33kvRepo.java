package com.test.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.model.Line33kv;

@Repository
public interface Line33kvRepo  extends JpaRepository<Line33kv, Integer>{

}
