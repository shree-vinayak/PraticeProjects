package com.astute.api;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.astute.electrical.dtos.DtrDevice;

@RestController
public class DtrDeviceApi {

	@Autowired
	private DtrDeviceApiService delegate;

	// To save the DtrDevice object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/dtrDevice", consumes = "application/json", produces = "application/json")
	public ResponseEntity<DtrDevice> addDtrDevice(@RequestBody DtrDevice dtrDevice) {
		return delegate.addDtrDevice(dtrDevice);
	}

	// To delete the DtrDevice object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/dtrDevice/{dtrDeviceId}", produces = "application/json")
	public ResponseEntity<Boolean> disableDtrDevice(@PathVariable("dtrDeviceId") Integer dtrDeviceId) {
		return delegate.disableDtrDevice(dtrDeviceId);
	}

	// To get all the DtrDevice by DtrId
	@GetMapping(value = "/dtrDevice/getDtrDeviceByDtrId/{dtrId}", produces = "application/json")
	public ResponseEntity<HashMap<String,Object>> getFeeder11kvByDtrId(@PathVariable("dtrId") Integer dtrId) {
		return delegate.getDtrDeviceByDtrId(dtrId);
	}

	// To update the DtrDevice Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/dtrDevice", consumes = "application/json", produces = "application/json")
	public ResponseEntity<DtrDevice> updateDtrDevice(@RequestBody DtrDevice dtrDevice) {
		return delegate.updateDtrDevice(dtrDevice);
	}
}
