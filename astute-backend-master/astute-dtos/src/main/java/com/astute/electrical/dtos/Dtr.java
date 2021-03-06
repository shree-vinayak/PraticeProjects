/*
 * Astute Energy API Specification.
 * Rest enpoints to be used with the Angular application for Astute Energy.
 *
 * The version of the OpenAPI document: 0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Dtr implements Serializable {

	@JsonProperty("dtrId")
	private Integer dtrId;

	@JsonProperty("name")
	private String name;

	@JsonProperty("dtrDtrDeviceMapping")
	private List<DtrDtrDeviceMapping> dtrDtrDeviceMapping;

	@JsonProperty("dtrPoleMapping")
	private List<DtrPoleMapping> dtrPoleMapping;

	@JsonProperty("feeder11kvDtrMapping")
	private List<Feeder11kvDtrMapping> feeder11kvDtrMapping;

	@JsonProperty("capacity")
	private String capacity;

	@JsonProperty("make")
	private String make;

	@JsonProperty("yearOfManufacturing")
	private Integer yearOfManufacturing;

}
