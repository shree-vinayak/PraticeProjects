
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PtrMake implements Serializable {

	@JsonProperty("ptrMakeId")
	private Integer ptrMakeId;

	@JsonProperty("make")
	private String make;

}
