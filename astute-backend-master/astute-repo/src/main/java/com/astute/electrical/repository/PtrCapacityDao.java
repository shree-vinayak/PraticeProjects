package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.PtrCapacityDto;

@Repository
public interface PtrCapacityDao extends JpaRepository<PtrCapacityDto, Integer> {

}
