package com.astute.api;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.EhvSs;

public abstract interface EhvSsApiService {

	public abstract ResponseEntity<EhvSs> addEhvSs(EhvSs ehvSs);

	public abstract ResponseEntity<Boolean> disableEhvSs(Integer id);

	public abstract ResponseEntity<List<EhvSs>> getAllEhvSsByRegionId(Integer idRegion);

//	public abstract ResponseEntity<CustomEhvSsLine33kv> getEhvById(Integer ehvId);

	public abstract ResponseEntity<EhvSs> updateEhvSs(EhvSs ehvSs);

	public abstract ResponseEntity<List<EhvSs>> getAllEhvSsByCircleId(Integer id);

	public abstract ResponseEntity<HashMap<String, Object>> getEhvById(Integer ehvId);
}