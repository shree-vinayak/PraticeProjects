package com.astute.api.discom.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.astute.api.RegionApiService;
import com.astute.discom.adaptor.RegionApiAdaptor;
import com.astute.discom.dtos.Region;

@Component
@Service
public class RegionApiServiceImpl implements RegionApiService {

	@Autowired
	private RegionApiAdaptor regionApiAdaptor;

	@Override
	public ResponseEntity<Region> addRegion(Region region) {
		region = regionApiAdaptor.addRegion(region);
		return new ResponseEntity<Region>(region, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Region> deleteRegion(Integer id) {
		Region region = regionApiAdaptor.deleteRegion(id);
		return new ResponseEntity<Region>(region, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<Region>> getAllRegion(Integer idCompany, String name) {
		List<Region> regionList = null;
		if (idCompany > 0) {
			regionList = regionApiAdaptor.getAllRegion(idCompany);
		}
		if (name != null) {
			regionList = regionApiAdaptor.getCompany(name);
		}
		return new ResponseEntity<List<Region>>(regionList, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Map<String, Integer>> getRegionsCount(Integer idCompany) {
		Integer count = regionApiAdaptor.getRegionsCount(idCompany);
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("count", count);
		return new ResponseEntity<Map<String, Integer>>(map, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<Region> updateRegion(Region region) {
		Region regionResponse = regionApiAdaptor.updateRegion(region);
		return new ResponseEntity<Region>(regionResponse, HttpStatus.OK);
	}

}
