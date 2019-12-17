
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class FeederSupply implements Serializable {

	@JsonProperty("feederSupplyId")
	private Integer feederSupplyId;

	@JsonProperty("supplyType")
	private String supplyType;

}
