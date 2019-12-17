
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SubstationFeeder11kvMapping implements Serializable {

	@JsonProperty("ssFeeder11kvMappingId")
	private Integer ssFeeder11kvMappingId;

	@JsonProperty("feeder11kvId")
	private Integer feeder11kvId;

	@JsonProperty("substationId")
	private Integer substationId;

}
