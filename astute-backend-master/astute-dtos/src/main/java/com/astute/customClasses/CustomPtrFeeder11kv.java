package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Feeder11kv;

public class CustomPtrFeeder11kv {

	private Integer ptrId;

	private String name;

	private List<Feeder11kv> feeder11kvList;

	public Integer getPtrId() {
		return ptrId;
	}

	public void setPtrId(Integer ptrId) {
		this.ptrId = ptrId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Feeder11kv> getFeeder11kvList() {
		return feeder11kvList;
	}

	public void setFeeder11kvList(List<Feeder11kv> feeder11kvList) {
		this.feeder11kvList = feeder11kvList;
	}

	public CustomPtrFeeder11kv(Integer ptrId, String name, List<Feeder11kv> feeder11kvList) {
		super();
		this.ptrId = ptrId;
		this.name = name;
		this.feeder11kvList = feeder11kvList;
	}

	public CustomPtrFeeder11kv(Integer ptrId, List<Feeder11kv> feeder11kvList) {
		super();
		this.ptrId = ptrId;
		this.feeder11kvList = feeder11kvList;
	}

	public CustomPtrFeeder11kv(Integer ptrId) {
		super();
		this.ptrId = ptrId;
	}

	public CustomPtrFeeder11kv(Integer ptrId, String name) {
		super();
		this.ptrId = ptrId;
		this.name = name;
	}

	public CustomPtrFeeder11kv() {

	}

}
