package com.astute.api;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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

import com.astute.electrical.dtos.Pole;

@RestController
public class PoleApi {

	@Autowired
	private PoleApiService delegate;

	// To save the Pole Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/pole", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Pole> addPole(@RequestBody Pole pole) {
		return delegate.addPole(pole);
	}

	// To delete the Pole Object
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/pole/{poleId}", produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<Boolean> disablePole(@PathVariable("poleId") Integer poleId) {
		return delegate.disablePole(poleId);
	}

	@GetMapping(value = "/pole/getPoleByDtrId/{dtrId}", produces = "application/json")
	public ResponseEntity<HashMap<String,Object>> getPoleByDtrId(@PathVariable("dtrId") Integer dtrId) {
		return delegate.getPoleByDtrId(dtrId);
	}

	// To update the Pole
	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/pole", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Pole> updatePole(@RequestBody Pole pole) {
		return delegate.updatePole(pole);
	}
}
