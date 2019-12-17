package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Line33kv;

public class CustomEhvSsLine33kv {

	private Integer ehvSsId;

	private String name;

	private List<Line33kv> line33kv;

	public CustomEhvSsLine33kv(Integer ehvSsId, String name) {
		super();
		this.ehvSsId = ehvSsId;
		this.name = name;
	}

	public CustomEhvSsLine33kv() {
		super();
	}

	public Integer getEhvSsId() {
		return ehvSsId;
	}

	public void setEhvSsId(Integer ehvSsId) {
		this.ehvSsId = ehvSsId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Line33kv> getLine33kv() {
		return line33kv;
	}

	public void setLine33kv(List<Line33kv> line33kv) {
		this.line33kv = line33kv;
	}

}
