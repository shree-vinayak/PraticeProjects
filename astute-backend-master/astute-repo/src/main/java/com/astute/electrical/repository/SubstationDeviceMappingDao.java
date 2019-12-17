package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.SubstationDeviceMappingDto;

@Repository
public interface SubstationDeviceMappingDao extends JpaRepository<SubstationDeviceMappingDto, Integer> {

	@Query("select count(*) from SubstationDeviceMappingDto where isActive=true and substationId=:substationId")
	public Integer getCount(@Param("substationId") Integer substationId);

	@Query("select sub.ssDeviceId from SubstationDeviceMappingDto  sub where isActive=true and substationId=:substationId order by substationDeviceMappingId desc")
	public List<Integer> getSsDeviceIdBySubstationId(@Param("substationId") Integer substationId);

	@Query(value = "delete from substation_device_mapping  where ssdevice_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();
}
