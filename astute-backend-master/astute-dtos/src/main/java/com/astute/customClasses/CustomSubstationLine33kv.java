package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Line33kv;

public class CustomSubstationLine33kv {

	private Integer substationId;

	private String name;

	private List<Line33kv> line33kvList;

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

	public List<Line33kv> getLine33kvList() {
		return line33kvList;
	}

	public void setLine33kvList(List<Line33kv> line33kvList) {
		this.line33kvList = line33kvList;
	}

}
