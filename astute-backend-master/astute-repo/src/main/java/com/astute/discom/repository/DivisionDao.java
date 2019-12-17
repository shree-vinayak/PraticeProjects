package com.astute.discom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.DivisionDto;

@Repository
public interface DivisionDao extends JpaRepository<DivisionDto, Integer> {

	@Query("from DivisionDto where isActive=true and idCircle =:idCircle order by idDivision desc")
	public List<DivisionDto> findDivisionByCircleId(@Param("idCircle") Integer idCircle);

	@Query("select count(*) from DivisionDto where isActive=true and idCircle=:idCircle")
	public Integer getCount(@Param("idCircle") Integer idCircle);

	@Query("select div from DivisionDto div where upper(div.name)=upper(:name)")
	public List<DivisionDto> findByName(@Param("name") String name);

	@Query("from DivisionDto where isActive=true and idDivision =:idDivision ")
	public DivisionDto findDivision(@Param("idDivision") Integer idDivision);

}
