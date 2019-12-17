package com.astute.iot.dto;

import java.time.LocalDateTime;

import com.astute.iot.model.VcbStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class LiveDataDto {
	// a.id
	@JsonProperty("id")
	private Integer id;

	// a.devID0
	@JsonProperty("deviceId")
	private String device_id;

	// b.pwr_act //b.PwrAcT
	@JsonProperty("activePower")
	private Float active_power;

	// b.pwr_app //b.PwrApp
	@JsonProperty("apparentPower")
	private Float apparent_power;

	// b.pwr_ret //b.PwrReT
	@JsonProperty("reactivePower")
	private Float reactive_power;

	// b.cur_lnr // b.curLnR
	@JsonProperty("rPhaseCurrent")
	private Float r_phase_current;

	// b.cur_lny//b.curLnY
	@JsonProperty("yPhaseCurrent")
	private Float y_phase_current;

	// b.cur_lnb//b.curLnB
	@JsonProperty("bPhaseCurrent")
	private Float b_phase_current;

	// b.vlt_phr//b.vltPhR
	@JsonProperty("rPhaseVoltage")
	private Float r_phase_voltage;

	// b.vlt_phy//b.vltPhY
	@JsonProperty("yPhaseVoltage")
	private Float y_phase_voltage;

	// b.vlt_phb//b.vltPhB
	@JsonProperty("bPhaseVoltage")
	private Float b_phase_voltage;
	// b.dmMdIm, b.dmMdEx, b.enKWhI, b.enKWhE, b.frAvHz

	@JsonProperty("demandImport")
	private Float demand_import;

	@JsonProperty("demandExport")
	private Float demand_export;

	// b.enkwhi//b.enKWhI
	@JsonProperty("meterCurrentReadingKwhImport")
	private Float meter_current_reading_kwh_import;

	// b.enkwhi//b.enKWhI
	@JsonProperty("meterCurrentReadingKwhExport")
	private Float meter_current_reading_kwh_export;

	@JsonProperty("frequency")
	private Float frequency;

	@JsonProperty("vcbStatus")
	private VcbStatus vcbStatus;

	// b.sn//b.sn
	@JsonProperty("sn")
	private Integer sn;

	// a.timestamp//a.timestamp
	@JsonProperty("timestamp")
	private LocalDateTime timestamp;

	//a.vltDc2
	@JsonProperty("wti")
    private Float wti;
	//a.vltDc3
    @JsonProperty("oti")
	private Float oti;
	//b.pfAvg
	@JsonProperty("powerFact")
	private Float powerFactor;
	//a.vltAC1
	@JsonProperty("acVoltage")
	private Float acVolt;
	//a.vltDC1
	@JsonProperty("dcVoltage")
	private Float dcVolt;



}
