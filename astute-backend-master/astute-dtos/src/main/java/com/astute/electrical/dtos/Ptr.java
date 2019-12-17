package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Ptr implements Serializable {

	@JsonProperty("ptrId")
	private Integer ptrId;

	@JsonProperty("name")
	private String name;

	@JsonProperty("line33kvPtrMapping")
	private List<Line33kvPtrMapping> line33kvPtrMapping;

	@JsonProperty("feeder11kvPtrMapping")
	private List<Feeder11kvPtrMapping> feeder11kvPtrMapping;

	@JsonProperty("capacity")
	private String capacity;

	@JsonProperty("make")
	private String make;

	@JsonProperty("yearOfManufacturing")
	private Integer yearOfManufacturing;

	@JsonProperty("substationId")
	private Integer substationId;

}
