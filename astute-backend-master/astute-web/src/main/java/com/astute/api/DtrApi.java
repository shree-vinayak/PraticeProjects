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

import com.astute.electrical.dtos.Dtr;
import com.astute.electrical.models.DtrCapacityDto;
import com.astute.electrical.models.DtrMakeDto;

@RestController
public class DtrApi {

	@Autowired
	private DtrApiService delegate;

	// To save the Dtr Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/dtr", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Dtr> addDtr(@RequestBody Dtr dtr) {
		return delegate.addDtr(dtr);
	}

	// To delete the Dtr object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/dtr/{id}", produces = "application/json")
	public ResponseEntity<Boolean> disableDtr(@PathVariable("id") Integer id) {
		return delegate.disableDtr(id);
	}

	// To get all the DtrDto according to the feederId
	@GetMapping(value = "/dtr/getDtrByFeeder11kvId/{feeder11kvId}", produces = "application/json")
	public ResponseEntity<HashMap<String, Object>> getFeeder11kvByDtrId(
			@PathVariable("feeder11kvId") Integer feeder11kvId) {
		return delegate.getAllDtrByFeederId(feeder11kvId);
	}

	@GetMapping(value = "/dtr/dtrCapacity", produces = "application/json")
	public ResponseEntity<List<DtrCapacityDto>> getDtrCapacity() {
		return delegate.getDtrCapacity();
	}

	@GetMapping(value = "/dtr/dtrMake", produces = "application/json")
	public ResponseEntity<List<DtrMakeDto>> getDtrMake() {
		return delegate.getDtrMake();
	}

	// To update the Dtr Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/dtr", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Dtr> updateDtr(@RequestBody Dtr dtr) {
		return delegate.updateDtr(dtr);
	}
}
