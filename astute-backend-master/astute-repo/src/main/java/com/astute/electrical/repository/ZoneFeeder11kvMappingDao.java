package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.ZoneFeeder11kvMappingDto;

@Repository
public interface ZoneFeeder11kvMappingDao extends JpaRepository<ZoneFeeder11kvMappingDto, Integer> {

	@Query("select p.feeder11kvId from ZoneFeeder11kvMappingDto p where isActive=true and idZone=:zoneId")
	List<Integer> getFeederKvIdsByZoneId(@Param("zoneId") Integer zoneId);

}
