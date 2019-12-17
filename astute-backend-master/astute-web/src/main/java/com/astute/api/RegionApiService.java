package com.astute.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.astute.discom.dtos.Region;

public abstract interface RegionApiService {

	public abstract ResponseEntity<Region> addRegion(Region region);

	public abstract ResponseEntity<Region> deleteRegion(Integer id);

	public abstract ResponseEntity<List<Region>> getAllRegion(Integer idCompany, String name);

	public abstract ResponseEntity<Map<String, Integer>> getRegionsCount(Integer idCompany);

	public abstract ResponseEntity<Region> updateRegion(Region region);

}
