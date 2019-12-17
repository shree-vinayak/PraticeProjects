package com.test.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.test.model.Ehv;
import com.test.repo.EhvRepo;

@RestController
public class EhvController {

	
	@Autowired
	private EhvRepo ehvRepo;
	
	@GetMapping(value = "/getAllEhv")
	public ResponseEntity<List<Ehv>> getAll() {
		List<Ehv> circle = ehvRepo.findAll();
		return new ResponseEntity<List<Ehv>>(circle, HttpStatus.OK);
	}
	
	// Post method to save the object inside the db
		@PostMapping(value = "/saveEhv", headers = "Accept=application/json")
		public ResponseEntity<Ehv> save(@RequestBody Ehv ehv) {
			Ehv circle1 = ehvRepo.save(ehv);
			System.out.println("inside the cirlce");
			return new ResponseEntity<Ehv>(circle1, HttpStatus.OK);
		}
}
