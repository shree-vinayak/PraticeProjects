
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DtrMake implements Serializable {

	@JsonProperty("dtrMakeId")
	private Integer dtrMakeId;

	@JsonProperty("make")
	private String make;

}
