package com.astute.api;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.Dtr;
import com.astute.electrical.models.DtrCapacityDto;
import com.astute.electrical.models.DtrMakeDto;

public abstract interface DtrApiService {

	public abstract ResponseEntity<Dtr> addDtr(Dtr dtr);

	public abstract ResponseEntity<Boolean> disableDtr(Integer id);

	public abstract ResponseEntity<Dtr> updateDtr(Dtr dtr);

	public abstract ResponseEntity<HashMap<String,Object>> getAllDtrByFeederId(Integer feeder11kvId);

	public abstract ResponseEntity<List<DtrCapacityDto>> getDtrCapacity();

	public abstract ResponseEntity<List<DtrMakeDto>> getDtrMake();
}
