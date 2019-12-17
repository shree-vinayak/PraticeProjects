
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

import lombok.Data;

@Entity
@Table(name = "region")
@Data
@EntityListeners(AuditingEntityListener.class)
public class RegionDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idRegion;

	@Column(name = "idCompany", nullable = false)
	private Integer idCompany;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "contact", nullable = false)
	private Long contact;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commonAddressId", referencedColumnName = "idAddress")
	private AddressDto addressDto;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = CircleDto.class)
	@JoinColumn(name = "idRegion", referencedColumnName = "idRegion", updatable = false)
	private List<CircleDto> circleDto;

}
