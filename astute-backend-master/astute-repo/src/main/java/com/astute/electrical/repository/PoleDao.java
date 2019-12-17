package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.PoleDto;

@Repository
public interface PoleDao extends JpaRepository<PoleDto, Integer> {

	@Query("select pole from PoleDto pole where isActive=true and dtrId =:dtrId")
	public List<PoleDto> findByDtrId(@Param("dtrId") Integer dtrId);

	@Query("select pole.poleId, pole.number from PoleDto pole where isActive=true and poleId =:poleId")
	public List<Object[]> getPoleByPoleId(@Param("poleId") Integer poleId);

	@Query("select pole from PoleDto pole where isActive=true and poleId =:poleId")
	public PoleDto findByIds(@Param("poleId") Integer poleId);

}