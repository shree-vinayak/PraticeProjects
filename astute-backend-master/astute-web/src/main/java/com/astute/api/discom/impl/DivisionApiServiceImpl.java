package com.astute.api.discom.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.DivisionApiService;
import com.astute.discom.adaptor.DivisionApiAdaptor;
import com.astute.discom.dtos.Division;

@Component
@Service
public class DivisionApiServiceImpl implements DivisionApiService {

	@Autowired
	private DivisionApiAdaptor divisionApiAdaptor;

	@Override
	public ResponseEntity<Division> addDivision(Division division) {
		division = divisionApiAdaptor.addDivision(division);
		return new ResponseEntity<Division>(division, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Division> deleteDivision(Integer id) {
		Division division = divisionApiAdaptor.deleteDivision(id);
		return new ResponseEntity<Division>(division, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Division>> getAllDivision(Integer idCircle, String name) {
		List<Division> divisionList = null;
		if (idCircle >= 0) {
			divisionList = divisionApiAdaptor.getAllDivision(idCircle);
		}
		if (name != null) {
			divisionList = divisionApiAdaptor.getDivision(name);
		}
		return new ResponseEntity<List<Division>>(divisionList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Map<String, Integer>> getDivisionsCount(Integer idCircle) {
		Integer count = divisionApiAdaptor.getDivisionsCount(idCircle);
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("count", count);
		return new ResponseEntity<Map<String, Integer>>(map, HttpStatus.OK);

	}

	@Override
	public ResponseEntity<Division> updateDivision(Division division) {
		Division divisionResponse = divisionApiAdaptor.updateDivision(division);
		return new ResponseEntity<Division>(divisionResponse, HttpStatus.OK);
	}
}
