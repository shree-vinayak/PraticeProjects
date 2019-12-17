
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class ZoneFeeder11kvMapping implements Serializable {

	@JsonProperty("zoneFeeder11kvMappingId")
	private Integer zoneFeeder11kvMappingId;

	@JsonProperty("feeder11kvId")
	private Integer feeder11kvId;

	@JsonProperty("idZone")
	private Integer idZone;

}
