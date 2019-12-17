package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Line33kvPtrMapping implements Serializable {

	@JsonProperty("line33kvPtrMappingId")
	private Integer line33kvPtrMappingId;

	@JsonProperty("ptrId")
	private Integer ptrId;

	@JsonProperty("line33kvId")
	private Integer line33kvId;

}
