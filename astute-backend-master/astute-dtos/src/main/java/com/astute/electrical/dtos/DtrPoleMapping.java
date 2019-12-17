
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DtrPoleMapping implements Serializable {

	@JsonProperty("dtrPoleMappingId")
	private Integer dtrPoleMappingId;

	@JsonProperty("dtrId")
	private Integer dtrId;

	@JsonProperty("poleId")
	private Integer poleId;

}
