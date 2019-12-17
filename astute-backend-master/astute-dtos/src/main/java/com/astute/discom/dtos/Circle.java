package com.astute.discom.dtos;

import java.io.Serializable;
import java.util.List;

import com.astute.electrical.dtos.EhvSsCircleMapping;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Circle implements Serializable {

	@JsonProperty("idCircle")
	private Integer idCircle;

	@JsonProperty("idRegion")
	private Integer idRegion;

	@JsonProperty("name")
	private String name;

	@JsonProperty("email")
	private String email;

	@JsonProperty("contact")
	private Long contact;

	@JsonProperty("address")
	private Address address;

	@JsonProperty("division")
	private List<Division> division;

	@JsonProperty("ehvSsCircleMapping")
	private List<EhvSsCircleMapping> ehvSsCircleMapping;

}
