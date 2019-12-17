
package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Vendor implements Serializable {

	@JsonProperty("vendorId")
	private Integer vendorId;

	@JsonProperty("deviceTypeId")
	private Integer deviceTypeId;

	@JsonProperty("ss_device")
	private List<SsDevice> ssDevice;

	@JsonProperty("pole_device")
	private List<PoleDevice> poleDevice;

	@JsonProperty("dtrDevice")
	private List<DtrDevice> dtrDevice;

	@JsonProperty("vendorName")
	private String vendorName;

}
