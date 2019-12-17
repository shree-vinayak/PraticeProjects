package com.test.controller;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.test.model.Ehv;
import com.test.model.Line33kv;
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
			Ehv ehv1= new Ehv();
			ehv1.setName(ehv.getName());
			Set<Line33kv> line33kvs=ehv.getLine33kvs();
			Set<Line33kv> line33kvs2=new HashSet<Line33kv>();
			
			Iterator<Line33kv> itr= line33kvs.iterator();
			while(itr.hasNext()) {
				Line33kv line33kv=itr.next();
				line33kv.setEhv(ehv1);
				line33kvs2.add(line33kv);
			}
			ehv1.setLine33kvs(line33kvs2);
			Ehv circle1 = ehvRepo.save(ehv1);
			System.out.println("inside the cirlce");
			return new ResponseEntity<Ehv>(circle1, HttpStatus.OK);
		}
}
