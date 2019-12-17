package com.test.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.test.model.Circle;
import com.test.repo.CircleRepo;

@RestController
public class CircleController {

	@Autowired
	private CircleRepo circleRepo;
	
	@GetMapping(value = "/getAllCircle")
	public ResponseEntity<List<Circle>> getAll() {
		List<Circle> circle = circleRepo.findAll();
		return new ResponseEntity<List<Circle>>(circle, HttpStatus.OK);
	}
	
	// Post method to save the object inside the db
		@PostMapping(value = "/saveCircle", headers = "Accept=application/json")
		public ResponseEntity<Circle> save(@RequestBody Circle circle) {
			Circle circle1 = circleRepo.save(circle);
			System.out.println("inside the cirlce");
			return new ResponseEntity<Circle>(circle1, HttpStatus.OK);
		}
		
		@DeleteMapping(value = "/deleteCircle/{id}", headers = "Accept=application/json")
		public ResponseEntity<Integer> delete(@PathVariable("id") int id) {

			 try { circleRepo.deleteById(id);}
			 catch(Exception e) {
				 return new ResponseEntity<Integer>(0, HttpStatus.OK);
			 }
			
				return new ResponseEntity<Integer>(1, HttpStatus.OK);
			
		}
}
