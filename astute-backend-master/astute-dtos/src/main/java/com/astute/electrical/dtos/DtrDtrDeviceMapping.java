
package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DtrDtrDeviceMapping implements Serializable {

	@JsonProperty("dtrDtrDeviceMappingId")
	private Integer dtrDtrDeviceMappingId;

	@JsonProperty("dtrId")
	private Integer dtrId;

	@JsonProperty("dtrDeviceId")
	private Integer dtrDeviceId;

}
