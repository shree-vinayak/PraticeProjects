package com.astute.customClasses;

import com.astute.electrical.dtos.EhvSs;

public class CustomCircleEhvSs {

	private Integer idCircle;

	private String name;

	private EhvSs ehvSs;

	public Integer getIdCircle() {
		return idCircle;
	}

	public void setIdCircle(Integer idCircle) {
		this.idCircle = idCircle;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public EhvSs getEhvSs() {
		return ehvSs;
	}

	public void setEhvSs(EhvSs ehvSs) {
		this.ehvSs = ehvSs;
	}

	public CustomCircleEhvSs(Integer idCircle, String name) {
		super();
		this.idCircle = idCircle;
		this.name = name;
	}

	public CustomCircleEhvSs() {
		super();
	}

}
