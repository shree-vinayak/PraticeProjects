package com.astute.iot.service;

import java.util.List;
import java.util.Set;

import com.astute.iot.dto.CbismSubstationLogDto;
import com.astute.iot.dto.LiveDataDto;
import com.astute.iot.dto.VCBStatusMapWithTimeDto;
import com.astute.iot.model.CbismSubstationLog;

public interface CbismSubstationLogService {

	public CbismSubstationLog save(CbismSubstationLogDto logDto);

	public List<CbismSubstationLog> findAll();

	public VCBStatusMapWithTimeDto getAllVcbStatus(String ssDeviceId);

	public String getVcbStatusBySerialNumber(String ssDeviceId, String vcbSerialNumber);

	public Set<String> findLiveDevicesForToday();

	public List<LiveDataDto> findLiveDataForToday(String deviceID);
}
