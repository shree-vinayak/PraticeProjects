package com.astute.api.electrical.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.VcbApiService;
import com.astute.electrical.adaptor.VcbApiAdaptor;
import com.astute.electrical.dtos.SsDevice;

@Component
@Service
public class VcbApiServiceImpl implements VcbApiService {

	@Autowired
	private VcbApiAdaptor vcbApiAdaptor;

	@Override
	public ResponseEntity<SsDevice> addVcb(SsDevice ssDevice) {
		SsDevice ssDevice1 = vcbApiAdaptor.addVcb(ssDevice);
		return new ResponseEntity<SsDevice>(ssDevice1, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> deleteVcb(Integer id) {
		Boolean b = vcbApiAdaptor.deleteVcb(id);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<SsDevice> getVcb(Integer id) {
		SsDevice ssDevice = vcbApiAdaptor.getVcb(id);
		return new ResponseEntity<SsDevice>(ssDevice, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<SsDevice> updateVcb(SsDevice ssDevice) {
		// TODO Auto-generated method stub
		return null;
	}
}
