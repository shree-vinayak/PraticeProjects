package com.astute.electrical.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EhvSsCircleMapping implements Serializable {

	@JsonProperty("ehvSsCircleMappingId")
	private Integer ehvSsCircleMappingId;

	@JsonProperty("ehvSsId")
	private Integer ehvSsId;

	@JsonProperty("idCircle")
	private Integer idCircle;

	public EhvSsCircleMapping(Integer ehvSsCircleMappingId, Integer ehvSsId, Integer idCircle) {
		super();
		this.ehvSsCircleMappingId = ehvSsCircleMappingId;
		this.ehvSsId = ehvSsId;
		this.idCircle = idCircle;
	}

	public EhvSsCircleMapping() {
		super();
	}

}
