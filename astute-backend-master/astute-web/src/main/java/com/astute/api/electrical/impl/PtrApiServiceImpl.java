package com.astute.api.electrical.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.PtrApiService;
import com.astute.electrical.adaptor.PtrApiAdaptor;
import com.astute.electrical.dtos.Ptr;
import com.astute.electrical.models.PtrCapacityDto;
import com.astute.electrical.models.PtrMakeDto;

@Component
@Service
public class PtrApiServiceImpl implements PtrApiService {

	@Autowired
	private PtrApiAdaptor ptrApiAdaptor;

	@Override
	public ResponseEntity<Ptr> addPtr(Ptr ptr) {
		ptr = ptrApiAdaptor.addPtr(ptr);
		return new ResponseEntity<Ptr>(ptr, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disablePtr(Integer ptrId) {
		Boolean b = ptrApiAdaptor.disablePtr(ptrId);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<PtrMakeDto>> getPtrMake() {
		return new ResponseEntity<List<PtrMakeDto>>(ptrApiAdaptor.getPtrMake(), HttpStatus.OK);
	}

	// To get all the ptr According to the substationId
	@Override
	public ResponseEntity<HashMap<String,Object>> getAllPtrBySubstationId(Integer substationId) {
		HashMap<String,Object> hash = ptrApiAdaptor.getAllPtrBySubstationId(substationId);
		return new ResponseEntity<HashMap<String,Object>>(hash, HttpStatus.OK);
	}

	// To update the ptr
	@Override
	public ResponseEntity<Ptr> updatePtr(Ptr ptr) {
		ptr = ptrApiAdaptor.updatePtr(ptr);
		return new ResponseEntity<Ptr>(ptr, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<PtrCapacityDto>> getptrCapacity() {
		return new ResponseEntity<List<PtrCapacityDto>>(ptrApiAdaptor.getptrCapacity(), HttpStatus.OK);
	}
}
