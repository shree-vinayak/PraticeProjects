package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.FeederTypeDto;

@Repository
public interface FeederTypeDao extends JpaRepository<FeederTypeDto, Integer> {

}
