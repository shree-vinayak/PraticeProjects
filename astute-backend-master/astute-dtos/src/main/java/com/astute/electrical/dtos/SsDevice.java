
package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class SsDevice implements Serializable {

	@JsonProperty("ssDeviceId")
	private Integer ssDeviceId;

	@JsonProperty("number")
	private Long number;

	@JsonProperty("vendorId")
	private Integer vendorId;

	@JsonProperty("substationDeviceMapping")
	private List<SubstationDeviceMapping> substationDeviceMapping;

	@JsonProperty("installationDate")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date installationDate;

	@JsonProperty("simNumber")
	private Long simNumber;

	@JsonProperty("mobileNumber")
	private Long mobileNumber;

	@JsonProperty("telecomOperator")
	private String telecomOperator;

	@JsonProperty("vcb")
	private List<Vcb> vcb;

}
