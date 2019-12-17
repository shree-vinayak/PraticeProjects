package com.astute.api;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.astute.electrical.dtos.SsDevice;

@RestController
public class SsDeviceApi {

	@Autowired
	private SsDeviceApiService delegate;

	// To save the SsDevice Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/ssDevice", consumes = "application/json", produces = "application/json")
	public ResponseEntity<SsDevice> addSsDevice(@RequestBody SsDevice ssDevice) {
		return delegate.addSsDevice(ssDevice);
	}

	// To delete the SsDevice Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/ssDevice/{ssDeviceId}", produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<Boolean> disableSsDevice(@PathVariable("ssDeviceId") Integer ssDeviceId) {
		return delegate.disableSsDevice(ssDeviceId);
	}

	// To get all the SsDevice by substationId
	@GetMapping(value = "/ssDevice/getSsDeviceBySubstationId/{substationId}", produces = "application/json")
	public ResponseEntity<HashMap<String, Object>> getSsDeviceBySubstationId(
			@PathVariable("substationId") Integer substationId) {
		return delegate.getSsDeviceBySubstationId(substationId);
	}

	// To update the SsDevice
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/ssDevice", consumes = "application/json", produces = "application/json")
	public ResponseEntity<SsDevice> updateSsDevice(@RequestBody SsDevice ssDevice) {
		return delegate.updateSsDevice(ssDevice);
	}
}
