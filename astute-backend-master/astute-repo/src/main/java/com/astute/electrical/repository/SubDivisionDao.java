package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.SubdivisionDto;

@Repository
public interface SubDivisionDao extends JpaRepository<SubdivisionDto, Integer> {

	@Query("from SubdivisionDto where isActive=true and idDivision =:idDivision order by idSubdivision desc ")
	public List<SubdivisionDto> findSubDivisionByDivisionId(@Param("idDivision") Integer idDivision);

	@Query("select count(*) from SubdivisionDto where isActive=true and idDivision=:idDivision")
	public Integer getCount(@Param("idDivision") Integer idDivision);

	@Query("select sub from SubdivisionDto sub where upper(sub.name)=upper(:name)")
	public List<SubdivisionDto> findByName(@Param("name") String name);

	@Query("from SubdivisionDto where isActive=true and idSubdivision =:idSubdivision ")
	public SubdivisionDto findSubdivision(@Param("idSubdivision") Integer idSubdivision);

}
