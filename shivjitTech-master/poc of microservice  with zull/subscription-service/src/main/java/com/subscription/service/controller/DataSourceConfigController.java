package com.subscription.service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.subscription.service.entity.DataSourceProperties;
import com.subscription.service.result.ResultWrapper;
import com.subscription.service.service.DataSourceConfigService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class DataSourceConfigController {

	private static final Logger LOGGER = LoggerFactory.getLogger(DataSourceConfigController.class);

	@Autowired
	private DataSourceConfigService dataSrcConfigService;

	@GetMapping("/hii")
	public String configureDataSource() {
		return "hii";
	}

	@GetMapping("/activate/{id}")
	public ResponseEntity<ResultWrapper<DataSourceProperties>> configureDataSource(@PathVariable(value = "id") String id) {
		LOGGER.info("Client has made request to actvate his services by userId : ", id);
		ResultWrapper<DataSourceProperties> rs = dataSrcConfigService.configureDataSource(id);
		return new ResponseEntity<ResultWrapper<DataSourceProperties>>(rs, HttpStatus.OK);
	}

}
