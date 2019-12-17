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
@Table(name = "substation")
@Data
@EntityListeners(AuditingEntityListener.class)
public class SubstationDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer substationId;

	private String name;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Substation33kvlineMappingDto.class)
	@JoinColumn(name = "substationId", referencedColumnName = "substationId")
	private List<Substation33kvlineMappingDto> substation33kvlineMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = SubstationDeviceMappingDto.class)
	@JoinColumn(name = "substationId", referencedColumnName = "substationId")
	private List<SubstationDeviceMappingDto> substationDeviceMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = SubstationFeeder11kvMappingDto.class)
	@JoinColumn(name = "substationId", referencedColumnName = "substationId")
	private List<SubstationFeeder11kvMappingDto> ssFeeder11kvMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = PtrDto.class)
	@JoinColumn(name = "substationId", referencedColumnName = "substationId")
	private List<PtrDto> ptr;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ZoneSubstationMappingDto.class)
	@JoinColumn(name = "substationId", referencedColumnName = "substationId")
	private List<ZoneSubstationMappingDto> zoneSubstationMapping;

}