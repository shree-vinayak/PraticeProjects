package com.eureka.zuul.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.eureka.zuul.model.Pkg;
import com.eureka.zuul.results.ResultWrapper;
import com.eureka.zuul.service.PackageService;

@RestController
public class PackageController {

	private static final Logger LOGGER = LoggerFactory.getLogger(PackageController.class);

	@Autowired
	private PackageService packageService;

	@GetMapping("/packages")
	public ResponseEntity<ResultWrapper<List<Pkg>>> getAll() {
		LOGGER.info("User has made request to get all package list");
		ResultWrapper<List<Pkg>> rs = packageService.getAll();
		return new ResponseEntity<ResultWrapper<List<Pkg>>>(rs, HttpStatus.OK);
	}

	@PostMapping("/package")
	public ResponseEntity<ResultWrapper<Pkg>> saveSubcsription(@RequestBody Pkg pkg) {
		LOGGER.info("Client has made request to create service : ", pkg.getPkgName());
		ResultWrapper<Pkg> rs = packageService.createPkg(pkg);
		return new ResponseEntity<ResultWrapper<Pkg>>(rs, HttpStatus.OK);
	}

}
