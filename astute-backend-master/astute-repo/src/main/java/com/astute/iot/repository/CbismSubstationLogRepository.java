package com.astute.iot.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.astute.iot.model.CbismSubstationLog;

@Repository
public interface CbismSubstationLogRepository extends JpaRepository<CbismSubstationLog, Integer> {

	@Query("SELECT log FROM CbismSubstationLog log WHERE log.devID0 = ?0")
	Set<CbismSubstationLog> findAllDeviceLogs();

	// Retrieve records corresponding to a ss_device on that particular date
	ArrayList<CbismSubstationLog> findByDevID0AndTimestampBetween(String devID0, LocalDateTime start,
			LocalDateTime end);

	// Retrieve records on a particular date for a ss_device and order them by
	// rtTim(ASC)
	ArrayList<CbismSubstationLog> findByDevID0AndTimestampBetweenOrderByRtTimeAsc(String devID0, LocalDateTime start,
			LocalDateTime end);

	// Retrieve the latest CBISM log for a device
	@Query(value = "select log from CbismSubstationLog log where log.id = (select max(id) from CbismSubstationLog where devID0 = ?1)")
	CbismSubstationLog getLatestLogByDeviceId(String deviceId);

	// Retrieve the latest 10 CBISM log for a device
	@Query(value = "select log from CbismSubstationLog log where log.devID0 = ?1 order by log.id desc")
	List<CbismSubstationLog> getLatest10LogByDeviceId(String deviceId, Pageable pageable);

	// query to show live data
	@Query("select DISTINCT a.id, a.devID0 , b.PwrAcT, b.PwrApp, b.PwrReT , b.curLnR , b.curLnY , b.curLnB , b.vltPhR ,b.vltPhY , b.vltPhB , b.dmMdIm, b.dmMdEx, b.enKWhI, b.enKWhE, b.frAvHz , b.vcbStatus , b.sn, a.timestamp,a.vltDC2, a.vltDC3, b.PfAvrg, a.volAC1, a.volDC1 from  CbismSubstationLog a , DtaMFM b "
			+ "where a.id = b.id_cbism_substation_log and a.devID0 =:deviceID and a.timestamp between :start and :end and b.sn=1 order by a.timestamp desc")
	List<Object[]> getLiveData(@Param("deviceID") String deviceID, @Param("start") LocalDateTime start,
			@Param("end") LocalDateTime end ,Pageable pageable);

	@Query("SELECT DISTINCT log.devID0 FROM CbismSubstationLog log where log.timestamp between :start and :end")
	Set<String> findDistinctDeviceIdsBetweenDates(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
