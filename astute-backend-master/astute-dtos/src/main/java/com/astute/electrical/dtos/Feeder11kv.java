
package com.astute.electrical.dtos;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class Feeder11kv implements Serializable {

	@JsonProperty("feeder11kvId")
	private Integer feeder11kvId;

	@JsonProperty("name")
	private String name;

	@JsonProperty("feeder11kvDtrMapping")
	private List<Feeder11kvDtrMapping> feeder11kvDtrMapping;

	@JsonProperty("feeder11kvPtrMapping")
	private List<Feeder11kvPtrMapping> feeder11kvPtrMapping;

	@JsonProperty("ssFeeder11kvMapping")
	private List<SubstationFeeder11kvMapping> ssFeeder11kvMapping;

	@JsonProperty("zoneFeeder11kvMapping")
	private List<ZoneFeeder11kvMapping> zoneFeeder11kvMapping;

	@JsonProperty("feederType")
	private String feederType;

	@JsonProperty("feederSupply")
	private String feederSupply;

}
