
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DtrCapacity implements Serializable {

	@JsonProperty("dtrCapacityId")
	private Integer dtrCapacityId;

	@JsonProperty("capacity")
	private String capacity;

}
