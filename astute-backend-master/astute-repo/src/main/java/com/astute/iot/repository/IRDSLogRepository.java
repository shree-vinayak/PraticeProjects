package com.astute.iot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.iot.model.IRDSLog;

@Repository
public interface IRDSLogRepository extends JpaRepository<IRDSLog, Integer> {

}
