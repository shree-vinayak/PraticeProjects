package com.astute.api;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.Feeder11kv;
import com.astute.electrical.models.FeederSupplyDto;
import com.astute.electrical.models.FeederTypeDto;
import com.astute.electrical.models.VendorDto;

public abstract interface Feeder11kvApiService {

	public abstract ResponseEntity<Feeder11kv> addFeeder11kv(Feeder11kv feeder11kv);

	public abstract ResponseEntity<Boolean> disableFeeder11kv(Integer id);

	public abstract ResponseEntity<List<FeederSupplyDto>> getFeederSupply();

	public abstract ResponseEntity<HashMap<String,Object>> getFeeder11kvByPtrId(Integer ptrId);

	public abstract ResponseEntity<Feeder11kv> updateFeeder11kv(Feeder11kv feeder11kv);

	public abstract ResponseEntity<List<Feeder11kv>> getFeeder11kvBySubstationId(Integer substationId);

	public abstract ResponseEntity<List<Feeder11kv>> getFeeder11kvByZoneId(Integer zoneId);

	public abstract ResponseEntity<List<FeederTypeDto>> getFeederType();

	public abstract ResponseEntity<List<VendorDto>> getVendor();
}
