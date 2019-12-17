package com.astute.iot.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class CbismSubstationLogDto {
	@JsonProperty("alarms")
	private String alarms;

	@JsonProperty("devID0")
	private String devID0;

	@JsonProperty("vcbStt")
	private String vcbStt;

	@JsonProperty("requestType")
	private String requestType;

	@JsonProperty("volDC1")
	private String volDC1;

	@JsonProperty("vltDC3")
	private String vltDC3;

	@JsonProperty("volAC1")
	private String volAC1;

	@JsonProperty("vltDC2")
	private String vltDC2;

	@JsonProperty("dtaMFM")
	private List<DtaMFMDto> dtaMFM;

	@JsonProperty("rtDate")
	private String rtDate;

	@JsonProperty("TempC1")
	private String TempC1;

	@JsonProperty("paswrd")
	private String paswrd;

	@JsonProperty("rtTime")
	private String rtTime;
}
