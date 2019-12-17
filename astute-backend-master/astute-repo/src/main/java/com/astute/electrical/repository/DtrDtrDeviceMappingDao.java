package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.DtrDtrDeviceMappingDto;

@Repository
public interface DtrDtrDeviceMappingDao extends JpaRepository<DtrDtrDeviceMappingDto, Integer> {

	@Query("select count(*) from DtrDtrDeviceMappingDto where isActive=true and dtrId=:dtrId")
	Integer getCount(@Param("dtrId") Integer dtrId);

	@Query("select dtr.dtrDeviceId from DtrDtrDeviceMappingDto  dtr where isActive=true and dtrId=:dtrId order by dtrDtrDeviceMappingId desc")
	List<Integer> getDtrDeviceIdByDtrId(@Param("dtrId") Integer dtrId);

	@Query(value = "delete from dtr_dtr_device_mapping  where dtr_device_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();

}
