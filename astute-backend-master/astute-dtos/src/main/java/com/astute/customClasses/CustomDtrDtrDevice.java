package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.DtrDevice;

public class CustomDtrDtrDevice {

	private Integer dtrId;

	private String name;

	private List<DtrDevice> dtrDeviceList;

	public Integer getDtrId() {
		return dtrId;
	}

	public void setDtrId(Integer dtrId) {
		this.dtrId = dtrId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<DtrDevice> getDtrDeviceList() {
		return dtrDeviceList;
	}

	public void setDtrDeviceList(List<DtrDevice> dtrDeviceList) {
		this.dtrDeviceList = dtrDeviceList;
	}

}
