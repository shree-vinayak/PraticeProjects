package com.astute.iot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.astute.iot.model.SMSConfig;

@Repository
public interface SMSRepository extends JpaRepository<SMSConfig, Integer> {

}
