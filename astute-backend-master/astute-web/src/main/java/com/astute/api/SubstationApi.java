package com.astute.api;

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

import com.astute.customClasses.CustomSubstation;
import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.dtos.Substation;

@RestController
public class SubstationApi {

	@Autowired
	private SubstationApiService delegate;

	// To save the Substation Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/substation", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Substation> addSubstation(@RequestBody Substation substation) {
		return delegate.addSubstation(substation);
	}

	// To Delete the Substation Object
	@DeleteMapping(path = "/substation/{id}", produces = "application/json")
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	public ResponseEntity<Boolean> disableSubstation(@PathVariable("id") Integer id) {
		return delegate.disableSubstation(id);
	}

	@GetMapping(value = "/substation/getLine33kvs/{substationId}", produces = "application/json")
	public ResponseEntity<List<Line33kv>> getLine33kvsSubstationById(
			@PathVariable("substationId") Integer substationId) {
		return delegate.getLine33kvsSubstationById(substationId);
	}

	// To get all the Substation according to the zoneId
	@GetMapping(value = "/substation/getSubstations/{zoneId}", produces = "application/json")
	public ResponseEntity<List<CustomSubstation>> getSubstationByZoneId(@PathVariable("zoneId") Integer zoneId) {
		return delegate.getSubstationByZoneId(zoneId);
	}

	// To Update the Substation Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/substation", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Substation> updateSubstation(@RequestBody Substation substation) {
		return delegate.updateSubstation(substation);
	}

}
