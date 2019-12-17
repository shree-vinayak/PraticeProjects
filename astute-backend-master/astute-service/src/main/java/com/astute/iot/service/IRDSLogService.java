package com.astute.iot.service;

import java.util.List;

import com.astute.iot.dto.IRDSLogDto;
import com.astute.iot.model.IRDSLog;

public interface IRDSLogService {
	public IRDSLog save(IRDSLogDto logDto);

	public List<IRDSLog> findAll();
}
