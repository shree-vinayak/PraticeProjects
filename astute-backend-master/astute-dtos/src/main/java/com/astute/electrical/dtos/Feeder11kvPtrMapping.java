
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Feeder11kvPtrMapping implements Serializable {

	@JsonProperty("feeder11kvPtrMappingId")
	private Integer feeder11kvPtrMappingId;

	@JsonProperty("ptrId")
	private Integer ptrId;

	@JsonProperty("feeder11kvId")
	private Integer feeder11kvId;

}
