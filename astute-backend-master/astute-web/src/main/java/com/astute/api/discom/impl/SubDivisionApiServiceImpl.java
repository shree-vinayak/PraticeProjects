package com.astute.api.discom.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.SubdivisionApiService;
import com.astute.discom.adaptor.SubDivisionApiAdaptor;
import com.astute.discom.dtos.Subdivision;

@Component
@Service
public class SubDivisionApiServiceImpl implements SubdivisionApiService {

	@Autowired
	private SubDivisionApiAdaptor subDivisionApiAdaptor;

	@Override
	public ResponseEntity<Subdivision> addSubDivision(Subdivision subdivision) {
		subdivision = subDivisionApiAdaptor.addSubDivision(subdivision);
		return new ResponseEntity<Subdivision>(subdivision, HttpStatus.OK);

	}

	@Override
	public ResponseEntity<Subdivision> deleteSubDivision(Integer id) {
		Subdivision subdivision = subDivisionApiAdaptor.deleteSubDivision(id);
		return new ResponseEntity<Subdivision>(subdivision, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Subdivision>> getAllSubDivision(Integer idDivision, String name) {
		List<Subdivision> subdivisionList = null;
		if (idDivision > 0) {
			subdivisionList = subDivisionApiAdaptor.getAllSubDivision(idDivision);
		}
		if (name != null) {
			subdivisionList = subDivisionApiAdaptor.getSubdivision(name);
		}
		return new ResponseEntity<List<Subdivision>>(subdivisionList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Map<String, Integer>> getSubdivisionsCount(Integer idDivision) {
		Integer count = subDivisionApiAdaptor.getSubdivisionsCount(idDivision);
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("count", count);
		return new ResponseEntity<Map<String, Integer>>(map, HttpStatus.OK);

	}

	@Override
	public ResponseEntity<Subdivision> updateSubDivision(Subdivision subdivision) {
		subdivision = subDivisionApiAdaptor.updateSubDivision(subdivision);
		return new ResponseEntity<Subdivision>(subdivision, HttpStatus.OK);
	}

}
