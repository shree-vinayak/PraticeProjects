package com.astute.discom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.RegionDto;

@Repository
public interface RegionDao extends JpaRepository<RegionDto, Integer> {

	@Query("select reg from RegionDto reg where isActive=true and idCompany =:idCompany order by idRegion desc")
	public List<RegionDto> findRegionByCompanyId(@Param("idCompany") Integer idCompany);

	@Query("select count(*) from RegionDto where isActive=true and idCompany=:idCompany")
	public Integer getCount(@Param("idCompany") Integer idCompany);

	@Query("from RegionDto where isActive=true ")
	public List<RegionDto> findAllActiveRegion();

	@Query("select reg from RegionDto reg where upper(reg.name)=upper(:name)")
	public List<RegionDto> findByName(@Param("name") String name);

	@Query("select reg from RegionDto reg where isActive=true and idRegion =:idRegion ")
	public RegionDto findRegion(@Param("idRegion") Integer idRegion);

}
