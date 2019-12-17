package com.astute.api;

import java.util.HashMap;
import java.util.List;

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

import com.astute.electrical.dtos.Feeder11kv;
import com.astute.electrical.models.FeederSupplyDto;
import com.astute.electrical.models.FeederTypeDto;
import com.astute.electrical.models.VendorDto;

@RestController
public class Feeder11kvApi {

	@Autowired
	private Feeder11kvApiService delegate;

	// To save the Feeder11kv Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/feeder11kv", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Feeder11kv> addFeeder11kv(@RequestBody Feeder11kv feeder11kv) {
		return delegate.addFeeder11kv(feeder11kv);
	}

	// To delete the Feeder11kv Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/feeder11kv/{id}")
	public ResponseEntity<Boolean> disableFeeder11kv(@PathVariable("id") Integer id) {
		return delegate.disableFeeder11kv(id);
	}

	@GetMapping(value = "/feeder11kv/getFeederSupply", produces = "application/json")
	public ResponseEntity<List<FeederSupplyDto>> getFeederSupply() {
		return delegate.getFeederSupply();
	}

	@GetMapping(value = "/feeder11kv/getVendor", produces = "application/json")
	public ResponseEntity<List<VendorDto>> getVendor() {
		return delegate.getVendor();
	}

	@GetMapping(value = "/feeder11kv/getFeederType", produces = "application/json")
	public ResponseEntity<List<FeederTypeDto>> getFeederType() {
		return delegate.getFeederType();
	}

	// To get all the Feeder11kv according to the ptrId
	@GetMapping(value = "/feeder11kv/getFeeder11kvByPtrId/{ptrId}", produces = "application/json")
	public ResponseEntity<HashMap<String, Object>> getFeeder11kvByPtrId(@PathVariable("ptrId") Integer ptrId) {
		return delegate.getFeeder11kvByPtrId(ptrId);
	}

	// To get all the Feeder11kv according to the substationId
	@GetMapping(value = "/feeder11kv/getFeeder11kvBySubstationId/{substationId}", produces = "application/json")
	public ResponseEntity<List<Feeder11kv>> getFeeder11kvByDtrId(@PathVariable("substationId") Integer substationId) {
		return delegate.getFeeder11kvBySubstationId(substationId);
	}

	// To get all the Feeder11kv according to the zoneId
	@GetMapping(value = "/feeder11kv/getFeeder11kvByZoneId/{zoneId}", produces = "application/json")
	public ResponseEntity<List<Feeder11kv>> getFeeder11kvByZoneId(@PathVariable("zoneId") Integer zoneId) {
		return delegate.getFeeder11kvByZoneId(zoneId);
	}

	@PutMapping(value = "/feeder11kv", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Feeder11kv> updateFeeder11kv(@RequestBody Feeder11kv feeder11kv) {
		return delegate.updateFeeder11kv(feeder11kv);
	}
}
