package com.aartek.location.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import com.vividsolutions.jts.geom.Point;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "LOCATION")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Location implements Serializable {

	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(name = "location_name")
	private String locationName;

	@Column(columnDefinition = "geography(POINT, 4326)")
	public Point pgPoint;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getLocationName() {
		return locationName;
	}

	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}

	public Point getPgPoint() {
		return pgPoint;
	}

	public void setPgPoint(Point pgPoint) {
		this.pgPoint = pgPoint;
	}

}
