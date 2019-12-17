package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.VcbDto;

@Repository
public interface VcbDao extends JpaRepository<VcbDto, Integer> {

	@Query("select count(*) from VcbDto where isActive=true and ssDeviceId=:ssDeviceId")
	public Integer getCount(@Param("ssDeviceId") Integer ssDeviceId);

	@Query("from VcbDto where isActive=true and ssDeviceId=:ssDeviceId")
	public List<VcbDto> findAllActiveVcb(@Param("ssDeviceId") Integer ssDeviceId);

	@Query(" from VcbDto where isActive=true and ssDeviceId=:ssDeviceId")
	public VcbDto findVcb(@Param("ssDeviceId") Integer ssDeviceId);
}
