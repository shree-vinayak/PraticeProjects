package com.test.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.test.model.Ehv;

@Repository
public interface EhvRepo extends JpaRepository<Ehv, Integer>{

}
