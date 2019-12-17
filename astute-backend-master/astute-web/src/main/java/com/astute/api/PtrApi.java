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

import com.astute.electrical.dtos.Ptr;
import com.astute.electrical.models.PtrCapacityDto;
import com.astute.electrical.models.PtrMakeDto;

@RestController
public class PtrApi {

	@Autowired
	private PtrApiService delegate;

	// To save the ptr object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/ptr", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Ptr> addPtr(@RequestBody Ptr ptr) {
		return delegate.addPtr(ptr);
	}

	// To delete the ptr object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/ptr/{ptrId}", produces = "application/json")
	public ResponseEntity<Boolean> disablePtr(@PathVariable("ptrId") Integer ptrId) {
		return delegate.disablePtr(ptrId);
	}

	@GetMapping(value = "/ptr/ptrMake", produces = "application/json")
	public ResponseEntity<List<PtrMakeDto>> getPtrMake() {
		return delegate.getPtrMake();
	}

	@GetMapping(value = "/ptr/ptrCapacity", produces = "application/json")
	public ResponseEntity<List<PtrCapacityDto>> getptrCapacity() {
		return delegate.getptrCapacity();
	}

	// To get all the ptr according to the substationId

	@GetMapping(value = "/ptr/{substationId}", produces = "application/json")
	public ResponseEntity<HashMap<String, Object>> getAllPtrBySubstationId(
			@PathVariable("substationId") Integer substationId) {
		return delegate.getAllPtrBySubstationId(substationId);
	}

	// To update the Ptr Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/ptr", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Ptr> updatePtr(@RequestBody Ptr ptr) {
		return delegate.updatePtr(ptr);
	}

}
