package com.astute.api;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.Ptr;
import com.astute.electrical.models.PtrCapacityDto;
import com.astute.electrical.models.PtrMakeDto;

public abstract interface PtrApiService {

	public abstract ResponseEntity<Ptr> addPtr(Ptr ptr);

	public abstract ResponseEntity<Boolean> disablePtr(Integer id);

	public abstract ResponseEntity<List<PtrMakeDto>> getPtrMake();

	public abstract ResponseEntity<HashMap<String,Object>> getAllPtrBySubstationId(Integer substationId);

	public abstract ResponseEntity<Ptr> updatePtr(Ptr ptr);

	public abstract ResponseEntity<List<PtrCapacityDto>> getptrCapacity();
}
