
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class FeederType implements Serializable {

	@JsonProperty("feederTypeId")
	private Integer feederTypeId;

	@JsonProperty("type")
	private String type;

}
