package com.astute.api.discom.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.ZoneApiService;
import com.astute.discom.adaptor.ZoneApiAdaptor;
import com.astute.discom.dtos.Zone;

@Component
@Service
public class ZoneApiServiceImpl implements ZoneApiService {

	@Autowired
	private ZoneApiAdaptor zonApiAdaptor;

	@Override
	public ResponseEntity<Zone> addZone(Zone zone) {
		zone = zonApiAdaptor.addZone(zone);
		return new ResponseEntity<Zone>(zone, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Zone> deleteZone(Integer id) {
		Zone zone = zonApiAdaptor.deleteZone(id);
		return new ResponseEntity<Zone>(zone, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Zone>> getAllZone(Integer idSubdivision, String name) {
		List<Zone> zoneList = null;
		if (idSubdivision > 0) {
			zoneList = zonApiAdaptor.getAllZone(idSubdivision);
		}
		if (name != null) {
			zoneList = zonApiAdaptor.getZone(name);
		}
		return new ResponseEntity<List<Zone>>(zoneList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Map<String, Integer>> getZonesCount(Integer idSubdivision) {
		Integer count = zonApiAdaptor.getZonesCount(idSubdivision);
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("count", count);
		return new ResponseEntity<Map<String, Integer>>(map, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Zone> updateZone(Zone zone) {
		zone = zonApiAdaptor.updateZone(zone);
		return new ResponseEntity<Zone>(zone, HttpStatus.OK);
	}
}
