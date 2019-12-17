package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.Line33kvPtrMappingDto;

@Repository
public interface Line33kvPtrMappingDao extends JpaRepository<Line33kvPtrMappingDto, Integer> {

	@Query("from Line33kvPtrMappingDto where line33kvId =:line33kvId")
	public List<Line33kvPtrMappingDto> line33kvPtrMappingByLine33kvId(@Param("line33kvId") Integer line33kvId);

	@Query("select count(*) from Line33kvPtrMappingDto where isActive=true and line33kvId=:line33kvId")
	public Integer getCount(@Param("line33kvId") Integer line33kvId);

	@Query(value = "delete from line33kv_ptr_mapping  where ptr_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();
}
