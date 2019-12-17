
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Feeder11kvDtrMapping implements Serializable {

	@JsonProperty("feeder11kvDtrMappingId")
	private Integer feeder11kvDtrMappingId;

	@JsonProperty("feeder11kvId")
	private Integer feeder11kvId;

	@JsonProperty("dtrId")
	private Integer dtrId;

}
