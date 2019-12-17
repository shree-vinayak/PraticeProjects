package com.astute.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.astute.discom.dtos.Company;

public abstract interface CompanyApiService {

	public abstract ResponseEntity<Company> addCompany(Company company);

	public abstract ResponseEntity<Company> deleteCompany(Integer id);

	public abstract ResponseEntity<List<Company>> getAllCompany(Integer idState, String name);

	public abstract ResponseEntity<Map<String, Integer>> getCompaniesCount();

	public abstract ResponseEntity<Company> updateCompany(Company company);

}