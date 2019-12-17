package com.astute.api;

import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.astute.discom.dtos.Zone;

@RestController
public class ZoneApi {

	@Autowired
	private ZoneApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/zone", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Zone> addZone(@RequestBody Zone zone) {
		return delegate.addZone(zone);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/zone/{id}", produces = "application/json")
	public ResponseEntity<Zone> deleteZone(@PathVariable("id") Integer id) {
		return delegate.deleteZone(id);
	}

	@GetMapping(value = "/zone", produces = "application/json")
	public ResponseEntity<List<Zone>> getAllZone(
			@RequestParam(value = "idSubdivision", required = false) Integer idSubdivision,
			@RequestParam(value = "name", required = false) String name) {
		return delegate.getAllZone(idSubdivision, name);
	}

	@GetMapping(value = "/zone/count", produces = "application/json")
	public ResponseEntity<Map<String, Integer>> getZonesCount(@RequestParam("idSubdivision") Integer idSubdivision) {
		return delegate.getZonesCount(idSubdivision);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/zone", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Zone> updateZone(@RequestBody Zone zone) {
		return delegate.updateZone(zone);
	}
}
