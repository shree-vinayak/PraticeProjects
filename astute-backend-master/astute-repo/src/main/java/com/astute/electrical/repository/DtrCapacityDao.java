package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.DtrCapacityDto;

@Repository
public interface DtrCapacityDao extends JpaRepository<DtrCapacityDto, Integer> {

}
