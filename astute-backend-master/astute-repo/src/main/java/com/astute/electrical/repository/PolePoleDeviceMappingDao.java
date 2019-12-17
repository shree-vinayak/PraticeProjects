package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.PolePoleDeviceMappingDto;

@Repository
public interface PolePoleDeviceMappingDao extends JpaRepository<PolePoleDeviceMappingDto, Integer> {

	@Query("select count(*) from PolePoleDeviceMappingDto where isActive=true and poleId=:poleId")
	public Integer getCount(@Param("poleId") Integer poleId);

	@Query("select pd.poleDeviceId from PolePoleDeviceMappingDto pd where isActive=true and poleId=:poleId order by polePoleDeviceMappingId desc")
	public List<Integer> getPoleDeviceIdsByPoleId(@Param("poleId") Integer poleId);

	@Query(value = "delete from pole_pole_device_mapping  where pole_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();
}
