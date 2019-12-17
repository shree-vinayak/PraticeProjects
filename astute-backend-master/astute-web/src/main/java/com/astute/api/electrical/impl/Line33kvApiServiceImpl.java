package com.astute.api.electrical.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.Line33kvApiService;
import com.astute.customClasses.CustomEhvSsLine33kv;
import com.astute.electrical.adaptor.Line33kvApiAdaptor;
import com.astute.electrical.dtos.Line33kv;

@Component
@Service
public class Line33kvApiServiceImpl implements Line33kvApiService {

	@Autowired
	private Line33kvApiAdaptor line33kvApiAdaptor;

	@Override
	public ResponseEntity<Line33kv> addLine33kv(Line33kv line33kv) {
		line33kv = line33kvApiAdaptor.addLine33kv(line33kv);
		return new ResponseEntity<Line33kv>(line33kv, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Boolean> disableLine33kv(Integer id) {
		Boolean b = line33kvApiAdaptor.disableLine33kv(id);
		return new ResponseEntity<Boolean>(b, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Line33kv> updateLine33kv(Line33kv line33kv) {
		line33kv = line33kvApiAdaptor.updateLine33kv(line33kv);
		return new ResponseEntity<Line33kv>(line33kv, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<CustomEhvSsLine33kv>> getAllCustomEhvSsLine33kv(Integer ehvSsId) {
		List<CustomEhvSsLine33kv> customEhvSsLine33kvsList = null;
		return new ResponseEntity<List<CustomEhvSsLine33kv>>(customEhvSsLine33kvsList, HttpStatus.OK);
	}
}
