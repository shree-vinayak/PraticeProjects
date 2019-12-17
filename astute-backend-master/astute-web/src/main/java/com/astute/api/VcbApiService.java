package com.astute.api;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.SsDevice;

public abstract interface VcbApiService {

	public abstract ResponseEntity<SsDevice> addVcb(SsDevice ssDevice);

	public abstract ResponseEntity<Boolean> deleteVcb(Integer id);

	public abstract ResponseEntity<SsDevice> getVcb(Integer id);

	public abstract ResponseEntity<SsDevice> updateVcb(SsDevice ssDevice);

}
