package com.astute.api.electrical.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.Feeder11kvApiService;
import com.astute.electrical.adaptor.Feeder11kvApiAdapter;
import com.astute.electrical.dtos.Feeder11kv;
import com.astute.electrical.models.FeederSupplyDto;
import com.astute.electrical.models.FeederTypeDto;
import com.astute.electrical.models.VendorDto;

@Component
@Service
public class Feeder11kvApiServiceImpl implements Feeder11kvApiService {
	@Autowired
	Feeder11kvApiAdapter feederAdapter;

	@Override
	public ResponseEntity<Feeder11kv> addFeeder11kv(Feeder11kv feeder11kv) {
		feeder11kv = feederAdapter.addFeeder11kv(feeder11kv);
		return new ResponseEntity<Feeder11kv>(feeder11kv, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disableFeeder11kv(Integer id) {
		Boolean b = feederAdapter.disableFeeder11kv(id);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<FeederSupplyDto>> getFeederSupply() {
		List<FeederSupplyDto> feederSupplyDtos = feederAdapter.getFeederSupply();
		return new ResponseEntity<List<FeederSupplyDto>>(feederSupplyDtos, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<HashMap<String,Object>> getFeeder11kvByPtrId(Integer ptrId) {
		HashMap<String,Object> customPtrFeeder11kvs = feederAdapter.getFeeder11kvByPtrId(ptrId);
		return new ResponseEntity<HashMap<String,Object>>(customPtrFeeder11kvs, HttpStatus.OK);

	}

	@Override
	public ResponseEntity<Feeder11kv> updateFeeder11kv(Feeder11kv feeder11kv) {
		feeder11kv = feederAdapter.updateFeeder11kv(feeder11kv);
		return new ResponseEntity<Feeder11kv>(feeder11kv, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Feeder11kv>> getFeeder11kvBySubstationId(Integer substationId) {
		List<Feeder11kv> feeder11kvs = feederAdapter.getFeeder11kvBySubstationId(substationId);
		return new ResponseEntity<List<Feeder11kv>>(feeder11kvs, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Feeder11kv>> getFeeder11kvByZoneId(Integer zoneId) {
		List<Feeder11kv> feeder11kvsList = feederAdapter.getFeeder11kvByZoneId(zoneId);
		return new ResponseEntity<List<Feeder11kv>>(feeder11kvsList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<FeederTypeDto>> getFeederType() {
		List<FeederTypeDto> feederType = feederAdapter.getFeederType();
		return new ResponseEntity<List<FeederTypeDto>>(feederType, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<VendorDto>> getVendor() {
		List<VendorDto> vendorDtos = feederAdapter.getAllVendor();
		return new ResponseEntity<List<VendorDto>>(vendorDtos, HttpStatus.OK);

	}
}
