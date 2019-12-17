package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.DtrPoleMappingDto;

@Repository
public interface DtrPoleMappingDao extends JpaRepository<DtrPoleMappingDto, Integer> {

	@Query("select dtr.poleId from DtrPoleMappingDto dtr where isActive=true and dtrId=:dtrId order by dtrPoleMappingId desc")
	public List<Integer> getPoleIdsByDtrId(@Param("dtrId") Integer dtrId);

	@Query(value = "delete from dtr_pole_mapping  where pole_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();

}
