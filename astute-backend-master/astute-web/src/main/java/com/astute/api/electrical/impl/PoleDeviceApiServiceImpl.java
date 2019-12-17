package com.astute.api.electrical.impl;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.PoleDeviceApiService;
import com.astute.electrical.adaptor.PoleDeviceApiAdapter;
import com.astute.electrical.dtos.PoleDevice;

@Component
@Service
public class PoleDeviceApiServiceImpl implements PoleDeviceApiService {
	@Autowired
	PoleDeviceApiAdapter poleDeviceApiAdapter;

	@Override
	public ResponseEntity<PoleDevice> addPoleDevice(PoleDevice poleDevice) {
		return new ResponseEntity<PoleDevice>(poleDeviceApiAdapter.addPoleDevice(poleDevice), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disablePoleDevice(Integer id) {
		return new ResponseEntity<Boolean>(poleDeviceApiAdapter.disablePoleDevice(id), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<PoleDevice> getPoleDeviceById(Integer poleDeviceId) {
		return new ResponseEntity<PoleDevice>(poleDeviceApiAdapter.getPoleDeviceById(poleDeviceId), HttpStatus.OK);
	}

	// !TODO
	@Override
	public ResponseEntity<PoleDevice> updatePoleDevice(PoleDevice poleDevice) {
		return new ResponseEntity<PoleDevice>(poleDeviceApiAdapter.updatePoleDevice(poleDevice), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<HashMap<String, Object>> getPoleDeviceByPoleId(Integer poleId) {
		HashMap<String, Object> customPolePoleDevice = poleDeviceApiAdapter.getPoleDeviceByPoleId(poleId);
		return new ResponseEntity<HashMap<String, Object>>(customPolePoleDevice, HttpStatus.OK);
	}
}
