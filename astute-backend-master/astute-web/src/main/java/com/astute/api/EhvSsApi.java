
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.astute.electrical.dtos.EhvSs;

@RestController
public class EhvSsApi {

	@Autowired
	private EhvSsApiService delegate;

	// To save the EhvSs
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/ehvSs", consumes = "application/json", produces = "application/json")
	public ResponseEntity<EhvSs> addEhvSs(@RequestBody EhvSs ehvSs) {
		return delegate.addEhvSs(ehvSs);
	}

	// To delete the ehvSs
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/ehvSs/{id}", produces = "application/json")
	public ResponseEntity<Boolean> disableEhvSs(@PathVariable("id") Integer id) {
		return delegate.disableEhvSs(id);
	}

	// To get all the EhvSs according to the regionId
	@GetMapping(value = "/ehvSs/getEhvSsByRegionId", produces = "application/json")
	public ResponseEntity<List<EhvSs>> getAllCustomCircleEhvSs(@RequestParam("idRegion") Integer idRegion) {
		return delegate.getAllEhvSsByRegionId(idRegion);
	}

	// To get all the EhvSs According to circle Id
	@GetMapping(value = "/ehvSs/getEhvSsByCircleId/{idCircle}", produces = "application/json")
	public ResponseEntity<List<EhvSs>> getAllEhvSs(@PathVariable("idCircle") Integer idCircle) {
		return delegate.getAllEhvSsByCircleId(idCircle);
	}

	@GetMapping(value = "/ehvSs/{ehvId}", produces = "application/json")
	public ResponseEntity<HashMap<String, Object>> getEhvById(@PathVariable("ehvId") Integer ehvId) {
		return delegate.getEhvById(ehvId);
	}

	// To update the EhvSs Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/ehvSs", consumes = "application/json", produces = "application/json")
	public ResponseEntity<EhvSs> updateEhvSs(@RequestBody EhvSs ehvSs) {
		return delegate.updateEhvSs(ehvSs);
	}
}
