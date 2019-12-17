package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.Line33kvDto;

@Repository
public interface Line33kvDao extends JpaRepository<Line33kvDto, Integer> {

	@Query("from Line33kvDto  where isActive=true and ehvSsId=:ehvSsId")
	public List<Line33kvDto> findAllActiveLine33kvByEhvSsId(@Param("ehvSsId") Integer ehvSsId);

	@Query("from Line33kvDto  where isActive=true ")
	public List<Line33kvDto> findAllActiveLine33kv();

	@Query("select count(*) from Line33kvDto where isActive=true and ehvSsId=:ehvSsId")
	public Integer getCount(@Param("ehvSsId") Integer ehvSsId);

	@Query("select line.line33kvId, line.name from Line33kvDto line where isActive=true and ehvSsId =:ehvSsId order by line33kvId desc")
	public List<Object[]> findByEhvSsId(@Param("ehvSsId") Integer ehvSsId);

	@Query("from Line33kvDto  where isActive=true and line33kvId=:line33kvId")
	public Line33kvDto findByIds(@Param("line33kvId") Integer line33kvId);

}