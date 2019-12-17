package com.astute.api;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.PoleDevice;

public abstract interface PoleDeviceApiService {

	public abstract ResponseEntity<PoleDevice> addPoleDevice(PoleDevice poleDevice);

	public abstract ResponseEntity<Boolean> disablePoleDevice(Integer id);

	public abstract ResponseEntity<PoleDevice> getPoleDeviceById(Integer poleDeviceId);

	public abstract ResponseEntity<PoleDevice> updatePoleDevice(PoleDevice poleDevice);

	public abstract ResponseEntity<HashMap<String,Object>> getPoleDeviceByPoleId(Integer poleId);
}
