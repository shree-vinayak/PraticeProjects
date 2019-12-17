package com.astute.iot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.iot.model.DTRMLog;

@Repository
public interface DTRMLogRepository extends JpaRepository<DTRMLog, Integer> {

}
