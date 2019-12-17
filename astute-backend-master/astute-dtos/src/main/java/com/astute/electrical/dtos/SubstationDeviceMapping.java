
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SubstationDeviceMapping implements Serializable {

	@JsonProperty("substationDeviceMappingId")
	private Integer substationDeviceMappingId;

	@JsonProperty("substationId")
	private Integer substationId;

	@JsonProperty("ssDeviceId")
	private Integer ssDeviceId;

}
