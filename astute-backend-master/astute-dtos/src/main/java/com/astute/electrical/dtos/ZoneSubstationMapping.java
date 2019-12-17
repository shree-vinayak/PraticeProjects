
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ZoneSubstationMapping implements Serializable {

	@JsonProperty("zoneSubstationMappingId")
	private Integer zoneSubstationMappingId;

	@JsonProperty("substationId")
	private Integer substationId;

	@JsonProperty("idZone")
	private Integer idZone;

}
