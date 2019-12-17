package com.astute.api;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.DtrDevice;

public abstract interface DtrDeviceApiService {

	public abstract ResponseEntity<DtrDevice> addDtrDevice(DtrDevice dtrDevice);

	public abstract ResponseEntity<Boolean> disableDtrDevice(Integer id);

	public abstract ResponseEntity<DtrDevice> updateDtrDevice(DtrDevice dtrDevice);

	public abstract ResponseEntity<HashMap<String,Object>> getDtrDeviceByDtrId(Integer dtrId);
}
