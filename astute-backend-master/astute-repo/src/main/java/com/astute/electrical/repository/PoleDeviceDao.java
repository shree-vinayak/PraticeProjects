package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.PoleDeviceDto;

@Repository
public interface PoleDeviceDao extends JpaRepository<PoleDeviceDto, Integer> {

	@Query("from PoleDeviceDto where poleDeviceId=:poleDeviceId")
	public PoleDeviceDto findByIds(@Param("poleDeviceId") Integer poleDeviceId);

}