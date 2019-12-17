
package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Pole implements Serializable {

	@JsonProperty("poleId")
	private Integer poleId;

	@JsonProperty("polePoleDeviceMapping")
	private List<PolePoleDeviceMapping> polePoleDeviceMapping;

	@JsonProperty("dtrPoleMapping")
	private List<DtrPoleMapping> dtrPoleMapping;

	@JsonProperty("number")
	private String number;

}
