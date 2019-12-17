package com.astute.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
public class VcbApi {

	@Autowired
	public VcbApiService delegate;

	@PostMapping(path = "/vcb", consumes = "application/json", produces = "application/json")
	public ResponseEntity<SsDevice> addVcb(@RequestBody SsDevice ssDevice) {
		return delegate.addVcb(ssDevice);
	}

	@DeleteMapping(path = "/vcb/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<Boolean> deleteVcb(@PathVariable("id") Integer id) {
		return delegate.deleteVcb(id);
	}

	@GetMapping(value = "/vcb/{id}", produces = "application/json")
	public ResponseEntity<SsDevice> getVcb(@PathVariable("id") Integer id) {
		return delegate.getVcb(id);
	}

	@PutMapping(value = "/vcb", consumes = "application/json", produces = "application/json")
	public ResponseEntity<SsDevice> updateVcb(@RequestBody SsDevice ssDevice) {
		return delegate.updateVcb(ssDevice);
	}

}
