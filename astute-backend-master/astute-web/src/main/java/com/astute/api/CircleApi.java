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

import com.astute.discom.dtos.Circle;

@RestController
public class CircleApi {

	@Autowired
	private CircleApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/circle", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Circle> addCircle(@RequestBody Circle circle) {
		return delegate.addCircle(circle);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/circle/{id}", produces = "application/json")
	public ResponseEntity<Circle> deleteCircle(@PathVariable("id") Integer id) {
		return delegate.deleteCircle(id);
	}

	@GetMapping(value = "/circle", produces = "application/json")
	public ResponseEntity<List<Circle>> getAllCircle(
			@RequestParam(value = "idRegion", required = false) Integer idRegion,
			@RequestParam(value = "name", required = false) String name) {
		return delegate.getAllCircle(idRegion, name);
	}

	@GetMapping(value = "/circle/count", produces = "application/json")
	public ResponseEntity<Map<String, Integer>> getCirclesCount(@RequestParam("idRegion") Integer idRegion) {
		return delegate.getCirclesCount(idRegion);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/circle", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Circle> updateCircle(@RequestBody Circle circle) {
		return delegate.updateCircle(circle);
	}
}
