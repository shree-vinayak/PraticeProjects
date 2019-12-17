package com.astute.api;

import java.util.List;

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

import com.astute.customClasses.CustomEhvSsLine33kv;
import com.astute.electrical.dtos.Line33kv;

@RestController
public class Line33kvApi {

	@Autowired
	private Line33kvApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/line33kv", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Line33kv> addLine33kv(@RequestBody Line33kv line33kv) {
		return delegate.addLine33kv(line33kv);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/line33kv/{id}", produces = MediaType.TEXT_PLAIN_VALUE)
	public ResponseEntity<Boolean> disableLine33kv(@PathVariable("id") Integer id) {
		return delegate.disableLine33kv(id);
	}

	@GetMapping(value = "/line33kv/getLine/{ehvSsId}", produces = "application/json")
	public ResponseEntity<List<CustomEhvSsLine33kv>> getAllEhvSs(@PathVariable("ehvSsId") Integer ehvSsId) {
		return delegate.getAllCustomEhvSsLine33kv(ehvSsId);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/line33kv", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Line33kv> updateLine33kv(@RequestBody Line33kv line33kv) {
		return delegate.updateLine33kv(line33kv);
	}

}
