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

import com.astute.discom.dtos.Subdivision;

@RestController
public class SubdivisionApi {

	@Autowired
	private SubdivisionApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/subdivision", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Subdivision> addSubDivision(@RequestBody Subdivision subdivision) {
		return delegate.addSubDivision(subdivision);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/subdivision/{id}", produces = "application/json")
	public ResponseEntity<Subdivision> deleteSubDivision(@PathVariable("id") Integer id) {
		return delegate.deleteSubDivision(id);
	}

	@GetMapping(value = "/subdivision", produces = "application/json")
	public ResponseEntity<List<Subdivision>> getAllSubDivision(
			@RequestParam(value = "idDivision", required = false) Integer idDivision,
			@RequestParam(value = "name", required = false) String name) {
		return delegate.getAllSubDivision(idDivision, name);
	}

	@GetMapping(value = "/subdivision/count", produces = "application/json")
	public ResponseEntity<Map<String, Integer>> getSubdivisionsCount(@RequestParam("idDivision") Integer idDivision) {
		return delegate.getSubdivisionsCount(idDivision);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/subdivision", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Subdivision> updateSubDivision(@RequestBody Subdivision subdivision) {
		return delegate.updateSubDivision(subdivision);
	}
}
