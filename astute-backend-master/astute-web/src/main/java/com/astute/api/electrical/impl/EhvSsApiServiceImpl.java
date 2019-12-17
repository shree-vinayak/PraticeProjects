package com.astute.api.electrical.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.EhvSsApiService;
import com.astute.electrical.adaptor.EhvSsApiAdaptor;
import com.astute.electrical.dtos.EhvSs;

@Component
@Service
public class EhvSsApiServiceImpl implements EhvSsApiService {

	@Autowired
	private EhvSsApiAdaptor ehvSsApiAdaptor;

	@Override
	public ResponseEntity<EhvSs> addEhvSs(EhvSs ehvSs) {
		ehvSs = ehvSsApiAdaptor.addEhvSs(ehvSs);
		return new ResponseEntity<EhvSs>(ehvSs, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disableEhvSs(Integer id) {
		Boolean b = ehvSsApiAdaptor.disableEhvSs(id);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<EhvSs>> getAllEhvSsByRegionId(Integer idRegion) {
		List<EhvSs> ehvSs = ehvSsApiAdaptor.getAllEhvSsByRegionId(idRegion);
		return new ResponseEntity<List<EhvSs>>(ehvSs, HttpStatus.OK);
	}

	/*
	 * @Override public ResponseEntity<CustomEhvSsLine33kv> getEhvById(Integer
	 * ehvId) { CustomEhvSsLine33kv customEhvSsLine33kv =
	 * ehvSsApiAdaptor.getEhvById(ehvId); return new
	 * ResponseEntity<CustomEhvSsLine33kv>(customEhvSsLine33kv, HttpStatus.OK); }
	 */

	@Override
	public ResponseEntity<HashMap<String, Object>> getEhvById(Integer ehvId) {
		HashMap<String, Object> hashmap = ehvSsApiAdaptor.getEhvById(ehvId);
		return new ResponseEntity<HashMap<String, Object>>(hashmap, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<EhvSs> updateEhvSs(EhvSs ehvSs) {
		ehvSs = ehvSsApiAdaptor.updateEhvSs(ehvSs);
		return new ResponseEntity<EhvSs>(ehvSs, HttpStatus.OK);
	}

	// To get all the EhvSs By CircleId
	@Override
	public ResponseEntity<List<EhvSs>> getAllEhvSsByCircleId(Integer idCircle) {
		List<EhvSs> listEhvSs = ehvSsApiAdaptor.getAllEhvSs(idCircle);
		return new ResponseEntity<List<EhvSs>>(listEhvSs, HttpStatus.OK);
	}

}
