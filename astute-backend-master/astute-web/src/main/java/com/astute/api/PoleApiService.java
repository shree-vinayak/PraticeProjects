package com.astute.api;

import java.util.HashMap;

import org.springframework.http.ResponseEntity;

import com.astute.electrical.dtos.Pole;

public abstract interface PoleApiService {

	public abstract ResponseEntity<Pole> addPole(Pole pole);

	public abstract ResponseEntity<Boolean> disablePole(Integer id);

	public abstract ResponseEntity<Pole> updatePole(Pole pole);

	public abstract ResponseEntity<HashMap<String,Object>> getPoleByDtrId(Integer dtrId);
}
