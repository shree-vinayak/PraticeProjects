package com.astute.api.discom.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.astute.api.CompanyApiService;
import com.astute.discom.adaptor.CompanyApiAdaptor;
import com.astute.discom.dtos.Company;

@Service
public class CompanyApiServiceImpl implements CompanyApiService {

	@Autowired
	private CompanyApiAdaptor companyApiAdaptor;

	@Override
	public ResponseEntity<Company> addCompany(Company company) {
		company = companyApiAdaptor.addCompany(company);
		return new ResponseEntity<Company>(company, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Company> deleteCompany(Integer id) {
		Company company = companyApiAdaptor.deleteCompany(id);
		return new ResponseEntity<Company>(company, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Company>> getAllCompany(Integer idState, String name) {
		List<Company> companyList = null;
		if (idState > 0) {
			companyList = companyApiAdaptor.getAllCompany(idState);
		}
		if (name != null) {
			companyList = companyApiAdaptor.getCompany(name);
		}
		return new ResponseEntity<List<Company>>(companyList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Map<String, Integer>> getCompaniesCount() {
		Integer count = companyApiAdaptor.getCompaniesCount();
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("count", count);
		return new ResponseEntity<Map<String, Integer>>(map, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Company> updateCompany(Company company) {
		company = companyApiAdaptor.updateCompany(company);
		return new ResponseEntity<Company>(company, HttpStatus.OK);
	}

}
