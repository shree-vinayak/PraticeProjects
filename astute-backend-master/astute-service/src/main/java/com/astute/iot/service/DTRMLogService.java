package com.astute.iot.service;

import java.util.List;

import com.astute.iot.dto.DTRMLogDto;
import com.astute.iot.model.DTRMLog;

public interface DTRMLogService {
	public DTRMLog save(DTRMLogDto logDto);

	public List<DTRMLog> findAll();
}
