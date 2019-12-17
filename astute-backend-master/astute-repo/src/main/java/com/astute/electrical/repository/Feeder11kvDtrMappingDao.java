package com.astute.electrical.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.electrical.models.Feeder11kvDtrMappingDto;

@Repository
public interface Feeder11kvDtrMappingDao extends JpaRepository<Feeder11kvDtrMappingDto, Integer> {

	@Query("select count(*) from Feeder11kvDtrMappingDto where isActive=true and feeder11kvId=:feeder11kvId")
	public Integer getCount(@Param("feeder11kvId") Integer feeder11kvId);

	@Query("select feed.dtrId from Feeder11kvDtrMappingDto feed where isActive=true and feeder11kvId=:feeder11kvId order by feeder11kvDtrMappingId desc")
	public List<Integer> getDtrIdsByFeederId(@Param("feeder11kvId") Integer feeder11kvId);

	@Query(value = "delete from feeder11kv_dtr_mapping  where dtr_id is null", nativeQuery = true)
	public void deleteWhereIdIsNull();
}
