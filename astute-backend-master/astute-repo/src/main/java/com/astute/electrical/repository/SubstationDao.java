package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.SubstationDto;

@Repository
public interface SubstationDao extends JpaRepository<SubstationDto, Integer> {

	public Integer countByIsActive(Boolean isActive);

	@Query("select sub.substationId, sub.name from SubstationDto sub where isActive=true and substationId =:substationId")
	public List<Object[]> findByIds(@Param("substationId") Integer substationId);

	@Query("select sub from SubstationDto sub where isActive=true and substationId =:substationId")
	public SubstationDto findSubstationDtoById(@Param("substationId") Integer substationId);

}