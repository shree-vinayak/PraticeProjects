package com.astute.api.electrical.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.DtrApiService;
import com.astute.electrical.adaptor.DtrApiAdaptor;
import com.astute.electrical.dtos.Dtr;
import com.astute.electrical.models.DtrCapacityDto;
import com.astute.electrical.models.DtrMakeDto;

@Component
@Service
public class DtrApiServiceImpl implements DtrApiService {

	@Autowired
	DtrApiAdaptor adapter;

	@Override
	public ResponseEntity<Dtr> addDtr(Dtr dtr) {
		return new ResponseEntity<Dtr>(adapter.addDtr(dtr), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disableDtr(Integer id) {
		return new ResponseEntity<Boolean>(adapter.disableDtr(id), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Dtr> updateDtr(Dtr dtr) {
		return new ResponseEntity<Dtr>(adapter.updateDtr(dtr), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<HashMap<String,Object>> getAllDtrByFeederId(Integer feeder11kvId) {
		return new ResponseEntity<HashMap<String,Object>>(adapter.getAllDtrByFeederId(feeder11kvId), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<DtrCapacityDto>> getDtrCapacity() {
		return new ResponseEntity<List<DtrCapacityDto>>(adapter.getDtrCapacity(), HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<DtrMakeDto>> getDtrMake() {
		return new ResponseEntity<List<DtrMakeDto>>(adapter.getDtrMake(), HttpStatus.OK);
	}
}
