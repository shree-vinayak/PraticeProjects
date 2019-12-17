package com.aartek.location.service;

import java.util.List;

import org.springframework.stereotype.Service;


import com.aartek.location.model.Location;
import com.aartek.location.model.LocationDto;


public interface LocationService {

//	public Location save(Location location);

	public LocationDto save(LocationDto location);

	public List<LocationDto> getAll();

	public LocationDto update(LocationDto locationDto);

	public LocationDto get(Integer id);

	public void delete(Integer id);

	

}
