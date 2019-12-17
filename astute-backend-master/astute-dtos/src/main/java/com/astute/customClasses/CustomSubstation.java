package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Substation33kvlineMapping;

public class CustomSubstation {

	private Integer substationId;

	private String name;

	private List<Substation33kvlineMapping> substation33kvlineMapping;

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

	public List<Substation33kvlineMapping> getSubstation33kvlineMapping() {
		return substation33kvlineMapping;
	}

	public void setSubstation33kvlineMapping(List<Substation33kvlineMapping> substation33kvlineMapping) {
		this.substation33kvlineMapping = substation33kvlineMapping;
	}

}
