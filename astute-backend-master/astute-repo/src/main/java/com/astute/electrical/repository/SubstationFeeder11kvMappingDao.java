package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.SubstationFeeder11kvMappingDto;

@Repository
public interface SubstationFeeder11kvMappingDao extends JpaRepository<SubstationFeeder11kvMappingDto, Integer> {

	@Query("select count(*) from SubstationFeeder11kvMappingDto where isActive=true and substationId=:substationId")
	public Integer getCount(@Param("substationId") Integer substationId);

	@Query("select sub.feeder11kvId from SubstationFeeder11kvMappingDto sub where isActive=true and substationId=:substationId")
	public List<Integer> getFeeder11kvIdsBySubstationId(@Param("substationId") Integer substationId);

}
