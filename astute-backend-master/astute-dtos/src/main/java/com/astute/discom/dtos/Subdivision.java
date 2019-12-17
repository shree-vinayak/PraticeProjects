
package com.astute.discom.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Subdivision implements Serializable {

	@JsonProperty("idSubdivision")
	private Integer idSubdivision;

	@JsonProperty("idDivision")
	private Integer idDivision;

	@JsonProperty("name")
	private String name;

	@JsonProperty("email")
	private String email;

	@JsonProperty("contact")
	private Long contact;

	@JsonProperty("address")
	private Address address;

	@JsonProperty("zone")
	private List<Zone> zone;

}
