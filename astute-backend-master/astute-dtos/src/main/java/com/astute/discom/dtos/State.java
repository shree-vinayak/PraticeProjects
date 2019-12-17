
package com.astute.discom.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class State implements Serializable {

	@JsonProperty("stateId")
	private Integer stateId;

	@JsonProperty("stateName")
	private String stateName;

}
