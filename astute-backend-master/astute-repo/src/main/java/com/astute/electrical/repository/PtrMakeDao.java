package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.PtrMakeDto;

@Repository
public interface PtrMakeDao extends JpaRepository<PtrMakeDto, Integer> {

}
