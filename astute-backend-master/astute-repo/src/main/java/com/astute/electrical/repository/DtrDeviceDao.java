package com.astute.electrical.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.DtrDeviceDto;

@Repository
public interface DtrDeviceDao extends JpaRepository<DtrDeviceDto, Integer> {

	@Query("from DtrDeviceDto dtr where dtrDeviceId=:dtrDeviceId")
	public DtrDeviceDto findByIds(@Param("dtrDeviceId") Integer dtrDeviceId);

}