package com.astute.api.electrical.impl;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.DtrDeviceApiService;
import com.astute.electrical.adaptor.DtrDeviceApiAdaptor;
import com.astute.electrical.dtos.DtrDevice;

@Component
@Service
public class DtrDeviceApiServiceImpl implements DtrDeviceApiService {
	@Autowired
	private DtrDeviceApiAdaptor dtrDeviceApiAdaptor;

	// To save the DtrDevice
	@Override
	public ResponseEntity<DtrDevice> addDtrDevice(DtrDevice dtrDevice) {
		dtrDevice = dtrDeviceApiAdaptor.addDtrDevice(dtrDevice);
		return new ResponseEntity<DtrDevice>(dtrDevice, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disableDtrDevice(Integer dtrDeviceId) {
		Boolean b = dtrDeviceApiAdaptor.disableDtrDevice(dtrDeviceId);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<DtrDevice> updateDtrDevice(DtrDevice dtrDevice) {
		dtrDevice = dtrDeviceApiAdaptor.updateDtrDevice(dtrDevice);
		return new ResponseEntity<DtrDevice>(dtrDevice, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<HashMap<String, Object>> getDtrDeviceByDtrId(Integer dtrId) {
		HashMap<String, Object> hash = dtrDeviceApiAdaptor.getDtrDeviceByDtrId(dtrId);
		return new ResponseEntity<HashMap<String, Object>>(hash, HttpStatus.OK);
	}
}
