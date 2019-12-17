package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.EhvSsDto;

@Repository
public interface EhvSsDao extends JpaRepository<EhvSsDto, Integer> {

	@Query("from EhvSsDto where isActive=true")
	public List<EhvSsDto> findAllActiveEhvSs();

	@Query("select ehv from EhvSsDto ehv where upper(ehv.name)=upper(:name)")
	public List<EhvSsDto> findByName(@Param("name") String name);

	@Query("select ehv.ehvSsId, ehv.name from EhvSsDto ehv where isActive=true and ehvSsId =:ehvSsId")
	public List<Object[]> findByIds(@Param("ehvSsId") Integer ehvSsId);

	@Query("from EhvSsDto ehv where isActive=true and ehvSsId =:ehvSsId")
	public List<EhvSsDto> findByEhvSsId(@Param("ehvSsId") Integer ehvSsId);

	@Query("from EhvSsDto ehv where ehvSsId =:ehvSsId")
	public EhvSsDto findByEhvSsId1(@Param("ehvSsId") Integer ehvSsId);

	/*
	 * @Query("select ehv.ehvSsId, ehv.name from EhvSsDto ehv where isActive=true and ehvSsId =:ehvSsId"
	 * ) public EhvSsDto findById(@Param("ehvSsId")Integer ehvSsId);
	 */

}