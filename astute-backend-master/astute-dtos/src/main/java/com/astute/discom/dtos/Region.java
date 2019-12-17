
package com.astute.discom.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Region implements Serializable {

	@JsonProperty("idRegion")
	private Integer idRegion;

	@JsonProperty("idCompany")
	private Integer idCompany;

	@JsonProperty("name")
	private String name;

	@JsonProperty("email")
	private String email;

	@JsonProperty("contact")
	private Long contact;

	@JsonProperty("address")
	private Address address;

	@JsonProperty("circle")
	private List<Circle> circle;

}
