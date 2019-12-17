package com.astute.discom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.ZoneDto;

@Repository
public interface ZoneDao extends JpaRepository<ZoneDto, Integer> {

	@Query("from ZoneDto where isActive=true and idSubdivision =:idSubdivision order by idZone desc")
	public List<ZoneDto> findZoneBySubDivisionId(@Param("idSubdivision") Integer idSubdivision);

	@Query("select count(*) from ZoneDto where isActive=true and idSubdivision=:idSubdivision")
	public Integer getCount(@Param("idSubdivision") Integer idSubdivision);

	@Query("select zon from ZoneDto zon where upper(zon.name)=upper(:name)")
	public List<ZoneDto> findByName(@Param("name") String name);

	@Query("from ZoneDto where isActive=true and idZone =:idZone ")
	public ZoneDto findZone(@Param("idZone") Integer idZone);

}
