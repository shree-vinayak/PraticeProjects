
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PolePoleDeviceMapping implements Serializable {

	@JsonProperty("polePoleDeviceMappingId")
	private Integer polePoleDeviceMappingId;

	@JsonProperty("poleId")
	private Integer poleId;;

	@JsonProperty("poleDeviceId")
	private Integer poleDeviceId;

}
