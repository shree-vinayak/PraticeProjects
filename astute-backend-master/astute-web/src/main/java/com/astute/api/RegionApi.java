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

import com.astute.discom.dtos.Region;

@RestController
public class RegionApi {

	@Autowired
	private RegionApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "region", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Region> addRegion(@RequestBody Region region) {
		return delegate.addRegion(region);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/region/{id}", produces = "application/json")
	public ResponseEntity<Region> deleteRegion(@PathVariable("id") Integer id) {
		return delegate.deleteRegion(id);
	}

	@GetMapping(value = "/region", produces = "application/json")
	public ResponseEntity<List<Region>> getAllRegion(
			@RequestParam(value = "idCompany", required = false) Integer idCompany,
			@RequestParam(value = "name", required = false) String name) {
		return delegate.getAllRegion(idCompany, name);
	}

	@GetMapping(value = "/region/count", produces = "application/json")
	public ResponseEntity<Map<String, Integer>> getRegionsCount(@RequestParam("idCompany") Integer idCompany) {
		return delegate.getRegionsCount(idCompany);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/region", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Region> updateRegion(@RequestBody Region region) {
		return delegate.updateRegion(region);
	}
}
