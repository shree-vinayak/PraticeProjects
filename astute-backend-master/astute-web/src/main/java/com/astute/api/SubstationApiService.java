package com.astute.api;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.astute.customClasses.CustomSubstation;
import com.astute.electrical.dtos.Line33kv;
import com.astute.electrical.dtos.Substation;

public abstract interface SubstationApiService {

	public abstract ResponseEntity<Substation> addSubstation(Substation substation);

	public abstract ResponseEntity<Boolean> disableSubstation(Integer id);

	public abstract ResponseEntity<List<Line33kv>> getLine33kvsSubstationById(Integer substationId);

	public abstract ResponseEntity<Substation> updateSubstation(Substation substation);

	public abstract ResponseEntity<List<CustomSubstation>> getSubstationByZoneId(Integer zoneId);;
}