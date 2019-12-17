package com.astute.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.astute.discom.dtos.Zone;

public abstract interface ZoneApiService {

	public abstract ResponseEntity<Zone> addZone(Zone zone);

	public abstract ResponseEntity<Zone> deleteZone(Integer id);

	public abstract ResponseEntity<List<Zone>> getAllZone(Integer idSubdivision, String name);

	public abstract ResponseEntity<Map<String, Integer>> getZonesCount(Integer idSubdivision);

	public abstract ResponseEntity<Zone> updateZone(Zone zone);
}
