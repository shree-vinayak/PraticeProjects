package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.SsDeviceDto;

@Repository
public interface SsDeviceDao extends JpaRepository<SsDeviceDto, Integer> {

	public Integer countByIsActive(Boolean isActive);

	@Query("from SsDeviceDto where ssDeviceId=:ssDeviceId")
	public SsDeviceDto findByIds(@Param("ssDeviceId") Integer ssDeviceId);

	public List<SsDeviceDto> findByIsActive(Boolean isActive);

}