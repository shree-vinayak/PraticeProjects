package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.PtrDto;

@Repository
public interface PtrDao extends JpaRepository<PtrDto, Integer> {

//	@Query("SELECT SUM(p.capacity) FROM PtrDto p WHERE p.isActive=true")
//	public Long totalActivePtrCapacity();

	@Query("select ptr from PtrDto ptr where isActive=true and substationId =:substationId order by ptrId desc")
	public List<PtrDto> findBySubstationId(@Param("substationId") Integer substationId);

	@Query("select count(*) from PtrDto where isActive=true and substationId=:substationId")
	public Integer getCount(@Param("substationId") Integer substationId);

	@Query("select ptr.ptrId, ptr.name from PtrDto ptr where isActive=true and ptrId =:ptrId")
	public List<Object[]> getPtrByPtrId(@Param("ptrId") Integer ptrId);

	@Query("select ptr from PtrDto ptr where ptrId =:ptrId")
	public PtrDto findByIds(@Param("ptrId") Integer ptrId);

	@Query("SELECT SUM(CAST(p.capacity as integer)) FROM PtrDto p WHERE p.isActive=true")
	public Long totalActivePtrCapacity();

}