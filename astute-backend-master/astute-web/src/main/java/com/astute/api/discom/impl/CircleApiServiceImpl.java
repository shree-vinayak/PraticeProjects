package com.astute.api.discom.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.CircleApiService;
import com.astute.discom.adaptor.CircleApiAdaptor;
import com.astute.discom.dtos.Circle;

@Component
@Service
public class CircleApiServiceImpl implements CircleApiService {

	@Autowired
	public CircleApiAdaptor circleApiAdaptor;

	@Override
	public ResponseEntity<Circle> addCircle(Circle circle) {
		circle = circleApiAdaptor.addCircle(circle);
		return new ResponseEntity<Circle>(circle, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Circle> deleteCircle(Integer id) {
		Circle circle = circleApiAdaptor.deleteCircle(id);
		return new ResponseEntity<Circle>(circle, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Circle>> getAllCircle(Integer idRegion, String name) {

		List<Circle> circleList = null;
		if (idRegion > 0) {
			circleList = circleApiAdaptor.getAllCircle(idRegion);
		}
		if (name != null) {
			circleList = circleApiAdaptor.getCircle(name);
		}
		return new ResponseEntity<List<Circle>>(circleList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Map<String, Integer>> getCirclesCount(Integer idRegion) {
		Integer count = circleApiAdaptor.getCirclesCount(idRegion);
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("count", count);
		return new ResponseEntity<Map<String, Integer>>(map, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Circle> updateCircle(Circle circle) {
		circle = circleApiAdaptor.updateCircle(circle);
		return new ResponseEntity<Circle>(circle, HttpStatus.OK);
	}

}
