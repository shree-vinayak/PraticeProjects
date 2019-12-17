package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.PoleDevice;

public class CustomPolePoleDevice {

	private Integer poleId;

	private String number;

	private List<PoleDevice> poleDeviceList;

	public Integer getPoleId() {
		return poleId;
	}

	public void setPoleId(Integer poleId) {
		this.poleId = poleId;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public List<PoleDevice> getPoleDeviceList() {
		return poleDeviceList;
	}

	public void setPoleDeviceList(List<PoleDevice> poleDeviceList) {
		this.poleDeviceList = poleDeviceList;
	}

}
