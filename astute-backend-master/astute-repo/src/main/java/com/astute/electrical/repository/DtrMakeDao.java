package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.DtrMakeDto;

@Repository
public interface DtrMakeDao extends JpaRepository<DtrMakeDto, Integer> {

}
