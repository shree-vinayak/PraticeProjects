package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.Substation33kvlineMappingDto;

@Repository
public interface Substation33kvlineMappingDao extends JpaRepository<Substation33kvlineMappingDto, Integer> {

	@Query("from Substation33kvlineMappingDto where line33kvId =:line33kvId")
	public List<Substation33kvlineMappingDto> substation33kvlineMappingByLine33kvId(
			@Param("line33kvId") Integer line33kvId);

	@Query("select count(*) from Substation33kvlineMappingDto where isActive=true and line33kvId=:line33kvId")
	public Integer getCount(@Param("line33kvId") Integer line33kvId);

	@Query("select sub.line33kvId from Substation33kvlineMappingDto sub where isActive=true and substationId=:substationId")
	public List<Integer> getLine33kvIdsBySubstationId(@Param("substationId") Integer substationId);

	@Query(value = "delete from substation33kvline_mapping_dto  where  substation_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();
}
