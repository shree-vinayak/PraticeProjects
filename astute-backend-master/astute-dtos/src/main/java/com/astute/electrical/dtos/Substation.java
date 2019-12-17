package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Substation implements Serializable {

	@JsonProperty("substationId")
	private Integer substationId;

	@JsonProperty("name")
	private String name;

	@JsonProperty("substation33kvlineMapping")
	private List<Substation33kvlineMapping> substation33kvlineMapping;

	@JsonProperty("substationDeviceMapping")
	private List<SubstationDeviceMapping> substationDeviceMapping;

	@JsonProperty("ssFeeder11kvMapping")
	private List<SubstationFeeder11kvMapping> ssFeeder11kvMapping;

	@JsonProperty("ptr")
	private List<Ptr> ptr;

	@JsonProperty("zoneSubstationMapping")
	private List<ZoneSubstationMapping> zoneSubstationMapping;

}
