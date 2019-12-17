package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.VendorDto;

@Repository
public interface VendorDao extends JpaRepository<VendorDto, Integer> {

}
