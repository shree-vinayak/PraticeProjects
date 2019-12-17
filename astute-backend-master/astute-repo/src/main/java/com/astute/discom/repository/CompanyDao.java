package com.astute.discom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.discom.models.CompanyDto;

@Repository
public interface CompanyDao extends JpaRepository<CompanyDto, Integer> {

	@Query("select comp from CompanyDto comp where isActive=true and comp.stateDto.stateId =:id order by id desc")
	public List<CompanyDto> findAllActiveCompanies(@Param("id") Integer id);

//	@Query(value = "update company_dto set is_active = false where id =:id", nativeQuery = true)
//	void setIsActiveFalse(@Param("id") Integer id);

	/*
	 * @Query(value=
	 * "select * from company_dto where is_active=true and state_id =:id"
	 * ,nativeQuery=true) List<CompanyDto> findAllActiveCompanies(@Param("id")
	 * Integer id);
	 */

	@Query("select count(*) from CompanyDto where isActive=true")
	public Integer getCount();

	@Query(" from CompanyDto where isActive=true")
	public List<CompanyDto> findAllActiveCompanies();

	@Query("select comp from CompanyDto comp where upper(comp.name)=upper(:name)")
	public List<CompanyDto> findByName(@Param("name") String name);

	@Query("select comp from CompanyDto comp where isActive=true and id =:id ")
	public CompanyDto findCompany(@Param("id") Integer id);

}
