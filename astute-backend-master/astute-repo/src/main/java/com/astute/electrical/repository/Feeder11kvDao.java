package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.Feeder11kvDto;

@Repository
public interface Feeder11kvDao extends JpaRepository<Feeder11kvDto, Integer> {

	@Query("select feeder.feeder11kvId, feeder.name from Feeder11kvDto feeder where isActive=true and feeder11kvId =:feeder11kvId")
	public List<Object[]> findByIds(@Param("feeder11kvId") Integer feeder11kvId);

	@Query("select feeder from Feeder11kvDto feeder where isActive=true and feeder11kvId =:feeder11kvId")
	public Feeder11kvDto findFeeder11kvDtoById(@Param("feeder11kvId") Integer feeder11kvId);

}