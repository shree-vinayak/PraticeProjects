package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.ZoneSubstationMappingDto;

@Repository
public interface ZoneSubstationMappingDao extends JpaRepository<ZoneSubstationMappingDto, Integer> {

	@Query(" from ZoneSubstationMappingDto where isActive=true and idZone =:idZone ")
	public List<ZoneSubstationMappingDto> findSubstationByZoneId(@Param("idZone") Integer idZone);
}
