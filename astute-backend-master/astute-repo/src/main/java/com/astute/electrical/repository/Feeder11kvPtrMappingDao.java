package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.Feeder11kvPtrMappingDto;

@Repository
public interface Feeder11kvPtrMappingDao extends JpaRepository<Feeder11kvPtrMappingDto, Integer> {

	@Query("select count(*) from Feeder11kvPtrMappingDto where isActive=true and ptrId=:ptrId")
	public Integer getCount(@Param("ptrId") Integer ptrId);

	@Query("from Feeder11kvPtrMappingDto where isActive = true and ptrId =:ptrId order by feeder11kvPtrMappingId desc")
	List<Feeder11kvPtrMappingDto> feeder11kvPtrMappingDtoByPtrId(@Param("ptrId") Integer ptrId);

	@Query(value = "delete from feeder11kv_ptr_mapping  where feeder11kv_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();

}
