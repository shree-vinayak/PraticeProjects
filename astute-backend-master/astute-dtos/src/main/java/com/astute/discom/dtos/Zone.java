
package com.astute.discom.dtos;

import java.io.Serializable;
import java.util.List;

import com.astute.electrical.dtos.ZoneFeeder11kvMapping;
import com.astute.electrical.dtos.ZoneSubstationMapping;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Zone implements Serializable {

	@JsonProperty("idZone")
	private Integer idZone;

	@JsonProperty("idSubdivision")
	private Integer idSubdivision;

	@JsonProperty("name")
	private String name;

	@JsonProperty("email")
	private String email;

	@JsonProperty("contact")
	private Long contact;

	@JsonProperty("address")
	private Address address;

	@JsonProperty("zoneSubstationMapping")
	private List<ZoneSubstationMapping> zoneSubstationMapping;

	@JsonProperty("zoneFeeder11kvMapping")
	private List<ZoneFeeder11kvMapping> zoneFeeder11kvMapping;

}
