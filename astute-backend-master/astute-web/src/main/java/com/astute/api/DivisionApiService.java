package com.astute.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.astute.discom.dtos.Division;

public abstract interface DivisionApiService {

	public abstract ResponseEntity<Division> addDivision(Division division);

	public abstract ResponseEntity<Division> deleteDivision(Integer id);

	public abstract ResponseEntity<List<Division>> getAllDivision(Integer idCircle, String name);

	public abstract ResponseEntity<Map<String, Integer>> getDivisionsCount(Integer idCircle);

	public abstract ResponseEntity<Division> updateDivision(Division division);
}
