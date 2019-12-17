package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Ptr;

public class CustomSubstationPtr {

	private Integer substationId;

	private String name;

	private List<Ptr> listPtr;

	public CustomSubstationPtr(Integer substationId, String name) {
		super();
		this.substationId = substationId;
		this.name = name;
	}

	public CustomSubstationPtr() {
		super();
	}

	public CustomSubstationPtr(Integer substationId, String name, List<Ptr> listPtr) {
		super();
		this.substationId = substationId;
		this.name = name;
		this.listPtr = listPtr;
	}

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

	public List<Ptr> getListPtr() {
		return listPtr;
	}

	public void setListPtr(List<Ptr> listPtr) {
		this.listPtr = listPtr;
	}

}
