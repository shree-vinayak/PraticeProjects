package com.astute.api;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.astute.customClasses.CustomEhvSsLine33kv;
import com.astute.electrical.dtos.Line33kv;

public abstract interface Line33kvApiService {

	public abstract ResponseEntity<Line33kv> addLine33kv(Line33kv line33kv);

	public abstract ResponseEntity<Boolean> disableLine33kv(Integer id);

	public abstract ResponseEntity<Line33kv> updateLine33kv(Line33kv line33kv);

	public abstract ResponseEntity<List<CustomEhvSsLine33kv>> getAllCustomEhvSsLine33kv(Integer ehvSsId);
}