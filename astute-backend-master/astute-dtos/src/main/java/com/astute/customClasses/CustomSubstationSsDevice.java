package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.SsDevice;

public class CustomSubstationSsDevice {

	private Integer substationId;

	private String name;

	private List<SsDevice> ssDeviceList;

	public Integer getSubstationId() {
		return substationId;
	}

	public void setSubstationId(Integer substationId) {
		this.substationId = substationId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<SsDevice> getSsDeviceList() {
		return ssDeviceList;
	}

	public void setSsDeviceList(List<SsDevice> ssDeviceList) {
		this.ssDeviceList = ssDeviceList;
	}

	public CustomSubstationSsDevice() {
		super();
	}

	public CustomSubstationSsDevice(Integer substationId, String name, List<SsDevice> ssDeviceList) {
		super();
		this.substationId = substationId;
		this.name = name;
		this.ssDeviceList = ssDeviceList;
	}

}
