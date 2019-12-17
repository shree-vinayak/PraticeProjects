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

import com.test.model.Ehv;
import com.test.repo.EhvRepo;


@RestController
public class EhvController {

	
	@Autowired
	private EhvRepo  ehvRepo;
	
	// Post method to save the object inside the db
			@PostMapping(value = "/saveEhv", headers = "Accept=application/json")
			public ResponseEntity<Ehv> save(@RequestBody Ehv ehv) {
				Ehv ehv1 = ehvRepo.save(ehv);
				System.out.println("inside the cirlce");
				System.out.println("ehc "+ehv.getEhvCircle());
				return new ResponseEntity<Ehv>(ehv1, HttpStatus.OK);
			}
			
			@GetMapping(value = "/getAllEhv")
			public ResponseEntity<List<Ehv>> getAll() {
				List<Ehv> ehv = ehvRepo.findAll();
				return new ResponseEntity<List<Ehv>>(ehv, HttpStatus.OK);
			}
			
			@DeleteMapping(value = "/deleteEhv/{id}", headers = "Accept=application/json")
			public ResponseEntity<Integer> delete(@PathVariable("id") int id) {

				 try { ehvRepo.deleteById(id);}
				 catch(Exception e) {
					 return new ResponseEntity<Integer>(0, HttpStatus.OK);
				 }
				
					return new ResponseEntity<Integer>(1, HttpStatus.OK);
				
			}
}
