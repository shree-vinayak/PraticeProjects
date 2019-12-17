package com.astute.electrical.models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.astute.discom.models.Auditable;

import lombok.Data;

@Entity
@Table(name = "feeder11kv")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Feeder11kvDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer feeder11kvId;

	private String name;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Feeder11kvDtrMappingDto.class)
	@JoinColumn(name = "feeder11kvId", referencedColumnName = "feeder11kvId")
	private List<Feeder11kvDtrMappingDto> feeder11kvDtrMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Feeder11kvPtrMappingDto.class)
	@JoinColumn(name = "feeder11kvId", referencedColumnName = "feeder11kvId")
	private List<Feeder11kvPtrMappingDto> feeder11kvPtrMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = SubstationFeeder11kvMappingDto.class)
	@JoinColumn(name = "feeder11kvId", referencedColumnName = "feeder11kvId")
	private List<SubstationFeeder11kvMappingDto> ssFeeder11kvMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, targetEntity = ZoneFeeder11kvMappingDto.class)
	@JoinColumn(name = "feeder11kvId", referencedColumnName = "feeder11kvId")
	private List<ZoneFeeder11kvMappingDto> zoneFeeder11kvMapping;

	private String feederType;

	private String feederSupply;

}
