package com.aartek.location.controller;

import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.metadata.HikariDataSourcePoolMetadata;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aartek.location.model.LocationDto;
import com.aartek.location.service.LocationService;
import com.zaxxer.hikari.HikariDataSource;

@CrossOrigin(origins = "*")
@RestController
public class LocationController {
	@Autowired
	private LocationService locationService;

	@Autowired
	DataSource dataSource;

	@PostMapping("/location")
	public LocationDto createLocation(@RequestBody LocationDto location) {

		HikariDataSource ds = (HikariDataSource) dataSource;
		System.out.println("Instace of DBCP basic data source: " + ds);
		System.out.println("Driver class name: " + ds.getDriverClassName());
		System.out.println("Connection Pool size : " + ds.getMaximumPoolSize());
		System.out.println("pool name " + ds.getPoolName());
		System.out.println("jndi " + ds.getDataSourceJNDI());
		System.out.println("getIdleTimeout" + ds.getIdleTimeout());
		System.out.println("hikari datasource " + ds.toString());
		System.out.println("Url: " + ds.getJdbcUrl());
		System.out.println(new HikariDataSourcePoolMetadata(ds).getActive());
		System.out.println("pool name "+ds.getPoolName());
		System.out.println("pool name "+ds.getCatalog()+"   "+ds.getConnectionInitSql()+"   "+ds.getConnectionTestQuery());
		

		return locationService.save(location);
	}

	@PutMapping("/location")
	public LocationDto updateLocation(@RequestBody LocationDto location) {
		return locationService.update(location);
	}

	@GetMapping("/location/getAll")
	public List<LocationDto> getAllLocation() {
		return locationService.getAll();
	}

	@GetMapping("/location/{id}")
	public LocationDto getLocation(@PathVariable("id") Integer id) {
		return locationService.get(id);
	}

	@DeleteMapping("/location/{id}")
	public void deleteLocation(@PathVariable("id") Integer id) {
		locationService.delete(id);
	}
}
