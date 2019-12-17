package com.astute.api.electrical.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.SubstationApiService;
import com.astute.customClasses.CustomSubstation;
import com.astute.electrical.adaptor.SubstationApiAdaptor;
import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.dtos.Substation;

@Component
@Service
public class SubstationApiServiceImpl implements SubstationApiService {

	@Autowired
	private SubstationApiAdaptor substationApiAdaptor;

	// To save the substation
	@Override
	public ResponseEntity<Substation> addSubstation(Substation substation) {
		substation = substationApiAdaptor.addSubstation(substation);
		return new ResponseEntity<Substation>(substation, HttpStatus.OK);
	}

	// To delete all the SubstationApi
	@Override
	public ResponseEntity<Boolean> disableSubstation(Integer id) {
		Boolean b = substationApiAdaptor.disableSubstation(id);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	// To get all the Lines According to the substationId
	@Override
	public ResponseEntity<List<Line33kv>> getLine33kvsSubstationById(Integer substationId) {
		List<Line33kv> listLine33kv = substationApiAdaptor.getLine33kvBySubstationId(substationId);
		return new ResponseEntity<List<Line33kv>>(listLine33kv, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Substation> updateSubstation(Substation substation) {
		substation = substationApiAdaptor.updateSubstation(substation);
		return new ResponseEntity<Substation>(substation, HttpStatus.OK);
	}

	// To get the substation according to the zoneId
	@Override
	public ResponseEntity<List<CustomSubstation>> getSubstationByZoneId(Integer zoneId) {
		List<CustomSubstation> customSubstationsList = substationApiAdaptor.getSubstationByZoneId(zoneId);
		return new ResponseEntity<List<CustomSubstation>>(customSubstationsList, HttpStatus.OK);
	}

}
