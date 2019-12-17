package com.test.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.test.model.Line33kv;
import com.test.repo.EhvRepo;
import com.test.repo.Line33kvRepo;

@RestController
public class Line33kvController {

	@Autowired
	private Line33kvRepo line33kvRepo;
	
	@Autowired
	private EhvRepo ehvRepo;
	
	@GetMapping(value = "/getLine")
	public ResponseEntity<List<Line33kv>> getAll() {
		List<Line33kv> circle = line33kvRepo.findAll();
		return new ResponseEntity<List<Line33kv>>(circle, HttpStatus.OK);
	}
	
	// Post method to save the object inside the db
		@PostMapping(value = "/saveLine", headers = "Accept=application/json")
		public ResponseEntity<Line33kv> save(@RequestBody Line33kv circle) {
//			, @RequestParam idEhss
			Line33kv circle1 = line33kvRepo.save(circle);
//			circle1.setEhv(ehvRepo.getById(idEhss));
			System.out.println("inside the cirlce");
			return new ResponseEntity<Line33kv>(circle1, HttpStatus.OK);
		}
	
}
