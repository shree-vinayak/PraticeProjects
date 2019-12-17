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

import com.astute.electrical.models.EhvSsCircleMappingDto;

import lombok.Data;

@Entity
@Table(name = "circle")
@Data
@EntityListeners(AuditingEntityListener.class)
public class CircleDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idCircle;

	@Column(name = "idRegion", nullable = false)
	private Integer idRegion;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "contact", nullable = false)
	private Long contact;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commonAddressId", referencedColumnName = "idAddress", nullable = false)
	private AddressDto address;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = DivisionDto.class)
	@JoinColumn(name = "idCircle", referencedColumnName = "idCircle", updatable = false)
	private List<DivisionDto> division;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = EhvSsCircleMappingDto.class)
	@JoinColumn(name = "idCircle", referencedColumnName = "idCircle")
	private List<EhvSsCircleMappingDto> ehvSsCircleMapping;

}
