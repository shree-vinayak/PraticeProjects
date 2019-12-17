package com.astute.customClasses;

import java.util.List;

import com.astute.electrical.dtos.Pole;

public class CustomDtrPole {
	private Integer dtrId;
	private String name;
	private List<Pole> poleList;

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

	public List<Pole> getPoleList() {
		return poleList;
	}

	public void setPoleList(List<Pole> poleList) {
		this.poleList = poleList;
	}

	public CustomDtrPole() {
		super();
	}

}
