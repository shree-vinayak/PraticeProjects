package com.astute.api.electrical.impl;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.SsDeviceApiService;
import com.astute.electrical.adaptor.SsDeviceApiAdaptor;
import com.astute.electrical.dtos.SsDevice;

@Component
@Service
public class SsDeviceApiServiceImpl implements SsDeviceApiService {

	@Autowired
	private SsDeviceApiAdaptor ssDeviceApiAdaptor;

	@Override
	public ResponseEntity<SsDevice> addSsDevice(SsDevice ssDevice) {
		ssDevice = ssDeviceApiAdaptor.addSsDevice(ssDevice);
		return new ResponseEntity<SsDevice>(ssDevice, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disableSsDevice(Integer ssDeviceId) {
		Boolean b = ssDeviceApiAdaptor.disableSsDevice(ssDeviceId);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<SsDevice> updateSsDevice(SsDevice ssDevice) {
		ssDevice = ssDeviceApiAdaptor.updateSsDevice(ssDevice);
		return new ResponseEntity<SsDevice>(ssDevice, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<HashMap<String, Object>> getSsDeviceBySubstationId(Integer substationId) {
		HashMap<String, Object> hash = ssDeviceApiAdaptor.getSsDeviceBySubstationId(substationId);
		return new ResponseEntity<HashMap<String, Object>>(hash, HttpStatus.OK);
	}
}
