package com.astute.api;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.SsDevice;

public abstract interface SsDeviceApiService {

	public abstract ResponseEntity<SsDevice> addSsDevice(SsDevice ssDevice);

	public abstract ResponseEntity<Boolean> disableSsDevice(Integer id);

	public abstract ResponseEntity<SsDevice> updateSsDevice(SsDevice ssDevice);

	public abstract ResponseEntity<HashMap<String,Object>> getSsDeviceBySubstationId(Integer substationId);
}
