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

import com.astute.discom.dtos.Company;

@RestController
public class CompanyApi {

	@Autowired
	public CompanyApiService delegate;

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PostMapping(path = "/company", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Company> addCompany(@RequestBody Company company) {
		return delegate.addCompany(company);
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@DeleteMapping(path = "/company/{id}", produces = "application/json")
	public ResponseEntity<Company> deleteCompany(@PathVariable("id") Integer id) {
		return delegate.deleteCompany(id);
	}

	@GetMapping(value = "/company", produces = "application/json")
	public ResponseEntity<List<Company>> getAllCompany(
			@RequestParam(value = "idState", required = false) Integer idState,
			@RequestParam(value = "name", required = false) String name) {
		return delegate.getAllCompany(idState, name);
	}

	@GetMapping(value = "/company/count", produces = "application/json")
	public ResponseEntity<Map<String, Integer>> getCompaniesCount() {
		return delegate.getCompaniesCount();
	}

	@PreAuthorize("hasAnyRole('SUPERADMIN')")
	@PutMapping(value = "/company", consumes = "application/json", produces = "application/json")
	public ResponseEntity<Company> updateCompany(@RequestBody Company company) {
		return delegate.updateCompany(company);
	}
}
