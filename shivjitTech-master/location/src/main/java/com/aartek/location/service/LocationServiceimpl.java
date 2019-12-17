package com.aartek.location.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.metadata.HikariDataSourcePoolMetadata;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aartek.location.model.Location;
import com.aartek.location.model.LocationDto;
import com.aartek.location.repository.LocationRepository;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;

@Service
public class LocationServiceimpl implements LocationService {
	@Autowired
	private LocationRepository locationRepository;

	@PersistenceContext
	private EntityManager manager;

	@Override
	public List<LocationDto> getAll() {
		List<Location> locationList = locationRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
		List<LocationDto> locationDtoList = new ArrayList<LocationDto>();
		Iterator iterator = locationList.iterator();
	      while(iterator.hasNext()) {
	         Location location = (Location) iterator.next();
	         LocationDto result = new LocationDto();
	 		result.setId(location.getId());
	 		result.setLocationName(location.getLocationName());
	 		result.setLatitude(location.getPgPoint().getY());
	 		result.setLongitude(location.getPgPoint().getX());
	 		locationDtoList.add(result);
	      }
		return locationDtoList;
	}

	@Override
	public LocationDto update(LocationDto locationDto) {
		GeometryFactory gf = new GeometryFactory();
		Point point = gf.createPoint(new Coordinate( locationDto.getLongitude(),locationDto.getLatitude()));
		Location location = new Location();
		location.setId(locationDto.getId());
		location.setLocationName(locationDto.getLocationName());
		location.setPgPoint(point);
		Location locationObj = locationRepository.getOne(location.getId());
		if (locationObj == null) {
			return null;
		}
		if (locationObj.getLocationName() != location.getLocationName() && location.getLocationName() != null) {
			locationObj.setLocationName(location.getLocationName());
		}
		if (locationObj.getPgPoint() != location.getPgPoint() && location.getPgPoint() != null) {
			locationObj.setPgPoint(location.getPgPoint());
		}
		location = locationRepository.save(locationObj);
		LocationDto result = new LocationDto();
		result.setId(location.getId());
		result.setLocationName(location.getLocationName());
		result.setLatitude(location.getPgPoint().getY());
		result.setLongitude(location.getPgPoint().getX());
		return result;
	}

	@Override
	public LocationDto get(Integer id) {
		Location location =locationRepository.getOne(id);
		LocationDto result = new LocationDto();
		result.setId(location.getId());
		result.setLocationName(location.getLocationName());
		result.setLatitude(location.getPgPoint().getY());
		result.setLongitude(location.getPgPoint().getX());
		return result;

	}

	@Override
	public void delete(Integer id) {
		locationRepository.deleteById(id);
	}

	@Override
	@Transactional
	public LocationDto save(LocationDto locationDto) {

		GeometryFactory gf = new GeometryFactory();
		Point point = gf.createPoint(new Coordinate(locationDto.getLongitude(),locationDto.getLatitude()));
		Location location = new Location();
		location.setLocationName(locationDto.getLocationName());
		location.setPgPoint(point);
		location = locationRepository.save(location);
		LocationDto result = new LocationDto();
		result.setId(location.getId());
		result.setLocationName(location.getLocationName());
		result.setLatitude(location.getPgPoint().getY());
		result.setLongitude(location.getPgPoint().getX());
		return result;

	}

}
