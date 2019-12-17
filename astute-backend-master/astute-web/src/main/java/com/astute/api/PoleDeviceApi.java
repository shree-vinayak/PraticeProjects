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

import com.astute.electrical.dtos.PoleDevice;

@RestController
public class PoleDeviceApi {

	@Autowired
	private PoleDeviceApiService delegate;

	// To save the PoleDevice Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/poleDevice", consumes = "application/json", produces = "application/json")
	public ResponseEntity<PoleDevice> addPoleDevice(@RequestBody PoleDevice poleDevice) {
		return delegate.addPoleDevice(poleDevice);
	}

	// To delete the PoleDevice Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/poleDevice/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<Boolean> disablePoleDevice(@PathVariable("id") Integer id) {
		return delegate.disablePoleDevice(id);
	}

	@GetMapping(value = "/poleDevice/{poleDeviceId}", produces = "application/json")
	public ResponseEntity<PoleDevice> getPoleDeviceById(@PathVariable("poleDeviceId") Integer poleDeviceId) {
		return delegate.getPoleDeviceById(poleDeviceId);
	}

	@GetMapping(value = "/poleDevice/getPoleDeviceByPoleId/{poleId}", produces = "application/json")
	public ResponseEntity<HashMap<String, Object>> getPoleDeviceByPoleId(@PathVariable("poleId") Integer poleId) {
		return delegate.getPoleDeviceByPoleId(poleId);
	}

	// To update the PoleDevice Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/poleDevice", consumes = "application/json", produces = "application/json")
	public ResponseEntity<PoleDevice> updatePoleDevice(@RequestBody PoleDevice poleDevice) {
		return delegate.updatePoleDevice(poleDevice);
	}
}
