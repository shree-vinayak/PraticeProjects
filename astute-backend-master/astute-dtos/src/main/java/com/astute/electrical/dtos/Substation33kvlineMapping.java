package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Substation33kvlineMapping implements Serializable {

	@JsonProperty("substation33kvlineMappingId")
	private Integer substation33kvlineMappingId;

	@JsonProperty("line33kvId")
	private Integer line33kvId;

	@JsonProperty("substationId")
	private Integer substationId;

}
