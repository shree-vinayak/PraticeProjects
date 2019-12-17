package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.DtrDto;

@Repository
public interface DtrDao extends JpaRepository<DtrDto, Integer> {
	@Query("select dtr.dtrId, dtr.name from DtrDto dtr where isActive=true and dtrId =:dtrId")
	public List<Object[]> getDtrByDtrId(@Param("dtrId") Integer dtrId);

	@Query("select dtr from DtrDto dtr where isActive=true and feeder11kvId =:feeder11kvId")
	public List<DtrDto> findByFeeder11kvId(@Param("feeder11kvId") Integer feeder11kvId);

	@Query("select dtr from DtrDto dtr where isActive=true and dtrId =:dtrId")
	public DtrDto findByIds(@Param("dtrId") Integer dtrId);

}