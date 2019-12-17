package com.astute.discom.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.StateDto;

@Repository
public interface StateDao extends JpaRepository<StateDto, Integer> {

}
