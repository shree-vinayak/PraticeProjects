package com.astute.iot.repository;

import com.astute.report.model.DailyOutage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.xml.crypto.Data;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DailyOutageRepository extends JpaRepository<DailyOutage, Long> {
    public DailyOutage findBySsDeviceIdAndVcbSerialNumberAndOutageEndTime(String ssDeviceId, Integer vcbSerialNumber, LocalDateTime endTime);

    public List<DailyOutage> findBySsDeviceIdAndOutageStartTimeBetween(String ssDeviceId, LocalDateTime start, LocalDateTime end);
}
