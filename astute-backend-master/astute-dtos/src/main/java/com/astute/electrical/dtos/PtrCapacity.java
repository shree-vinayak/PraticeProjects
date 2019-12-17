
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PtrCapacity implements Serializable {

	@JsonProperty("ptrCapacityId")
	private Integer ptrCapacityId;

	@JsonProperty("capacity")
	private String capacity;

}
