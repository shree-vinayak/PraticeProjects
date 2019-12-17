package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.EhvSsCircleMappingDto;

@Repository
public interface EhvSsCircleMappingDao extends JpaRepository<EhvSsCircleMappingDto, Integer> {

	@Query("select ehvCir from EhvSsCircleMappingDto ehvCir where isActive=true and idCircle =:idCircle")
	public EhvSsCircleMappingDto findByCircleId(@Param("idCircle") Integer idCircle);

	@Query("select ehvCir from EhvSsCircleMappingDto ehvCir where isActive=true and idCircle =:idCircle")
	public List<EhvSsCircleMappingDto> findByCircleId1(@Param("idCircle") Integer idCircle);

	@Query(value = "delete from ehv_ss_circle_mapping  where ehv_ss_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();

}
