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

import com.astute.discom.dtos.Division;

@RestController
public class DivisionApi {

	@Autowired
	private DivisionApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/division", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Division> addDivision(@RequestBody Division division) {
		return delegate.addDivision(division);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/division/{id}", produces = "application/json")
	public ResponseEntity<Division> deleteDivision(@PathVariable("id") Integer id) {
		return delegate.deleteDivision(id);
	}

	@GetMapping(value = "/division", produces = "application/json")
	public ResponseEntity<List<Division>> getAllDivision(
			@RequestParam(value = "idCircle", required = false) Integer idCircle,
			@RequestParam(value = "name", required = false) String name) {
		return delegate.getAllDivision(idCircle, name);
	}

	@GetMapping(value = "/division/count", produces = "application/json")
	public ResponseEntity<Map<String, Integer>> getDivisionsCount(@RequestParam("idCircle") Integer idCircle) {
		return delegate.getDivisionsCount(idCircle);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/division", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Division> updateDivision(@RequestBody Division division) {
		return delegate.updateDivision(division);
	}
}
