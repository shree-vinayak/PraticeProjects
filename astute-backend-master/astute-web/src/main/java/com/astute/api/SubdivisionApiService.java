package com.astute.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.astute.discom.dtos.Subdivision;

public abstract interface SubdivisionApiService {

	public abstract ResponseEntity<Subdivision> addSubDivision(Subdivision subdivision);

	public abstract ResponseEntity<Subdivision> deleteSubDivision(Integer id);

	public abstract ResponseEntity<List<Subdivision>> getAllSubDivision(Integer idDivision, String name);

	public abstract ResponseEntity<Map<String, Integer>> getSubdivisionsCount(Integer idDivision);

	public abstract ResponseEntity<Subdivision> updateSubDivision(Subdivision subdivision);
}
