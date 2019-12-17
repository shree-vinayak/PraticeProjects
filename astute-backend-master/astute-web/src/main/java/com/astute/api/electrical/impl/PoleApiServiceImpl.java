package com.astute.api.electrical.impl;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.PoleApiService;
import com.astute.electrical.adaptor.PoleApiAdaptor;
import com.astute.electrical.dtos.Pole;

@Component
@Service
public class PoleApiServiceImpl implements PoleApiService {

	@Autowired
	private PoleApiAdaptor poleApiAdaptor;

	@Override
	public ResponseEntity<Pole> addPole(Pole pole) {
		pole = poleApiAdaptor.addPole(pole);
		return new ResponseEntity<Pole>(pole, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disablePole(Integer poleId) {
		Boolean b = poleApiAdaptor.disablePole(poleId);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Pole> updatePole(Pole pole) {
		return new ResponseEntity<Pole>(poleApiAdaptor.updatePole(pole), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<HashMap<String,Object>> getPoleByDtrId(Integer dtrId) {
		HashMap<String,Object> customDtrPole = poleApiAdaptor.getAllPoleByDtrId(dtrId);
		return new ResponseEntity<HashMap<String,Object>>(customDtrPole, HttpStatus.OK);
	}
}