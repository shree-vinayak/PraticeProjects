package com.astute.discom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.CircleDto;

@Repository
public interface CircleDao extends JpaRepository<CircleDto, Integer> {

	@Query("from CircleDto where isActive=true and idRegion =:idRegion order by idCircle desc")
	public List<CircleDto> findAllActiveRegion(@Param("idRegion") Integer idRegion);

	@Query("select count(*) from CircleDto where isActive=true and idRegion =:idRegion")
	Integer getCount(@Param("idRegion") Integer idRegion);

	@Query("select cir from CircleDto cir where upper(cir.name)=upper(:name)")
	public List<CircleDto> findByName(@Param("name") String name);

	@Query("from CircleDto where isActive=true and idCircle =:idCircle")
	public CircleDto findCircle(@Param("idCircle") Integer idCircle);

	@Query("select cir.idCircle, cir.name from CircleDto cir where isActive=true and idRegion =:idRegion")
	public List<Object[]> getCircleNameAndIdByRegionId(@Param("idRegion") Integer idRegion);

	@Query("select cir.idCircle from CircleDto cir where isActive=true and idRegion =:idRegion ")
	public List<Integer> getCircleIdsByRegionId(@Param("idRegion") Integer idRegion);

	@Query("select cir.idCircle, cir.name from CircleDto cir where isActive=true and idCircle =:idCircle")
	public List<Object[]> findCircleByCircleId(@Param("idCircle") Integer idCircle);

}
