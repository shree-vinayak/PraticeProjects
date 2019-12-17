package com.astute.discom.models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.astute.electrical.models.ZoneFeeder11kvMappingDto;
import com.astute.electrical.models.ZoneSubstationMappingDto;

import lombok.Data;

@Entity
@Table(name = "zone")
@Data
@EntityListeners(AuditingEntityListener.class)
public class ZoneDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idZone;

	@Column(name = "idSubdivision", nullable = false)
	private Integer idSubdivision;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "contact", nullable = false)
	private Long contact;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ZoneSubstationMappingDto.class)
	@JoinColumn(name = "idZone", referencedColumnName = "idZone", updatable = false)
	private List<ZoneSubstationMappingDto> zoneSubstationMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ZoneFeeder11kvMappingDto.class)
	@JoinColumn(name = "idZone", referencedColumnName = "idZone", updatable = false)
	private List<ZoneFeeder11kvMappingDto> zoneFeeder11kvMapping;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commonAddressId", referencedColumnName = "idAddress")
	private AddressDto address;

}
