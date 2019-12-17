package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EhvSs implements Serializable {

	@JsonProperty("ehvSsId")
	private Integer ehvSsId;

	@JsonProperty("name")
	private String name;

	@JsonProperty("ehvSsCircleMapping")
	private List<EhvSsCircleMapping> ehvSsCircleMapping;

	@JsonProperty("line33kv")
	private List<Line33kv> line33kv;

	public EhvSs(Integer ehvSsId, String name) {
		super();
		this.ehvSsId = ehvSsId;
		this.name = name;
	}

	public EhvSs() {
		super();
	}

}
