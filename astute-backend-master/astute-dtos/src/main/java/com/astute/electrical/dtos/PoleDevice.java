
package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class PoleDevice implements Serializable {

	@JsonProperty("poleDeviceId")
	private Integer poleDeviceId;

	@JsonProperty("number")
	private Long number;

	@JsonProperty("vendorId")
	private Integer vendorId;

	@JsonProperty("polePoleDeviceMapping")
	private List<PolePoleDeviceMapping> polePoleDeviceMapping;

	@JsonProperty("installationDate")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date installationDate;

	@JsonProperty("simNumber")
	private Long simNumber;

	@JsonProperty("mobileNumber")
	private Long mobileNumber;

	@JsonProperty("telecomOperator")
	private String telecomOperator;

	@JsonProperty("terminal")
	private String terminal;

}
