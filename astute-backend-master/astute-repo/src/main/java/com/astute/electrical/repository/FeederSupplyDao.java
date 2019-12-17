package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.FeederSupplyDto;

@Repository
public interface FeederSupplyDao extends JpaRepository<FeederSupplyDto, Integer> {

}
