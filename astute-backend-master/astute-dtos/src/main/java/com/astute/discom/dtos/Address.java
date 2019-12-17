
package com.astute.discom.dtos;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Address implements Serializable {

	@JsonProperty("idAddress")
	private Integer idAddress;

	@JsonProperty("address")
	private String address;

}
