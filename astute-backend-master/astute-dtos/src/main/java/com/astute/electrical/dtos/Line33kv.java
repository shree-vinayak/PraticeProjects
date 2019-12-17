
package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Line33kv implements Serializable {

	@JsonProperty("line33kvId")
	private Integer line33kvId;

	@JsonProperty("name")
	private String name;

	@JsonProperty("line33kvPtrMapping")
	private List<Line33kvPtrMapping> line33kvPtrMapping;

	@JsonProperty("substation33kvlineMapping")
	private List<Substation33kvlineMapping> substation33kvlineMapping;

	@JsonProperty("ehvSsId")
	private Integer ehvSsid;

	public Line33kv(Integer line33kvId, String name) {
		super();
		this.line33kvId = line33kvId;
		this.name = name;
	}

	public Line33kv() {
		super();
	}

}
