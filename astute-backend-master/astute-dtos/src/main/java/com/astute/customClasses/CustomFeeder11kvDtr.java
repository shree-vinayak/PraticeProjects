package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Dtr;

public class CustomFeeder11kvDtr {

	Integer feeder11kvId;
	String name;
	List<Dtr> dtrList;

	public CustomFeeder11kvDtr(Integer feeder11kvId, String name, List<Dtr> dtrList) {
		super();
		this.feeder11kvId = feeder11kvId;
		this.name = name;
		this.dtrList = dtrList;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Dtr> getDtrList() {
		return dtrList;
	}

	public void setDtrList(List<Dtr> dtrList) {
		this.dtrList = dtrList;
	}

	public Integer getFeeder11kvId() {
		return feeder11kvId;
	}

	public void setFeeder11kvId(Integer feeder11kvId) {
		this.feeder11kvId = feeder11kvId;
	}

	public CustomFeeder11kvDtr() {
		super();
	}

}
