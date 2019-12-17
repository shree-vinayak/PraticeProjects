package com.astute.iot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DtaMFMDto {
	@JsonProperty("id")
	private int id;

	@JsonProperty("vltPhY")
	private String vltPhY;

	@JsonProperty("PwrAcR")
	private String PwrAcR;

	@JsonProperty("PwrReB")
	private String PwrReB;

	@JsonProperty("PwrAcT")
	private String PwrAcT;

	@JsonProperty("PwrAcY")
	private String PwrAcY;

	@JsonProperty("PwrApB")
	private String PwrApB;

	@JsonProperty("dmMdIm")
	private String dmMdIm;

	@JsonProperty("PwrReR")
	private String PwrReR;

	@JsonProperty("PwrReT")
	private String PwrReT;

	@JsonProperty("curPhY")
	private String curPhY;

	@JsonProperty("PwrApY")
	private String PwrApY;

	@JsonProperty("dmMdEx")
	private String dmMdEx;

	@JsonProperty("PwrApR")
	private String PwrApR;

	@JsonProperty("PwrReY")
	private String PwrReY;

	@JsonProperty("PfAvrg")
	private String PfAvrg;

	@JsonProperty("curLnY")
	private String curLnY;

	@JsonProperty("curLnR")
	private String curLnR;

	@JsonProperty("frAvHz")
	private String frAvHz;

	@JsonProperty("vltPhB")
	private String vltPhB;

	@JsonProperty("curPhR")
	private String curPhR;

	@JsonProperty("PwrAcB")
	private String PwrAcB;

	@JsonProperty("PwrApp")
	private String PwrApp;

	@JsonProperty("curLnB")
	private String curLnB;

	@JsonProperty("enKWhE")
	private String enKWhE;

	@JsonProperty("enKWhI")
	private String enKWhI;

	@JsonProperty("vltPhR")
	private String vltPhR;

	@JsonProperty("curPhB")
	private String curPhB;

	@Override
	public String toString() {
		return "ClassPojo [vltPhY = " + vltPhY + ", PwrAcR = " + PwrAcR + ", PwrReB = " + PwrReB + ", PwrAcT = " + PwrAcT
				+ ", PwrAcY = " + PwrAcY + ", PwrApB = " + PwrApB + ", dmMdIm = " + dmMdIm + ", PwrReR = " + PwrReR
				+ ", PwrReT = " + PwrReT + ", curPhY = " + curPhY + ", PwrApY = " + PwrApY + ", dmMdEx = " + dmMdEx
				+ ", PwrApR = " + PwrApR + ", PwrReY = " + PwrReY + ", PfAvrg = " + PfAvrg + ", curLnY = " + curLnY
				+ ", curLnR = " + curLnR + ", frAvHz = " + frAvHz + ", vltPhB = " + vltPhB + ", curPhR = " + curPhR
				+ ", PwrAcB = " + PwrAcB + ", PwrApp = " + PwrApp + ", curLnB = " + curLnB + ", enKWhE = " + enKWhE
				+ ", enKWhI = " + enKWhI + ", vltPhR = " + vltPhR + ", curPhB = " + curPhB + "]";
	}
}
