package com.astute.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.astute.discom.dtos.Circle;

public abstract interface CircleApiService {

	public abstract ResponseEntity<Circle> addCircle(Circle circle);

	public abstract ResponseEntity<Circle> deleteCircle(Integer id);

	public abstract ResponseEntity<List<Circle>> getAllCircle(Integer idRegion, String name);

	public abstract ResponseEntity<Map<String, Integer>> getCirclesCount(Integer idRegion);

	public abstract ResponseEntity<Circle> updateCircle(Circle circle);
}
