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
@Table(name = "division")
@Data
@EntityListeners(AuditingEntityListener.class)
public class DivisionDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idDivision;

	@Column(name = "idCircle", nullable = false)
	private Integer idCircle;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "contact", nullable = false)
	private Long contact;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commomAddressId", referencedColumnName = "idAddress", nullable = false)
	private AddressDto address;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = SubdivisionDto.class)
	@JoinColumn(name = "idDivision", referencedColumnName = "idDivision", updatable = false)
	private List<SubdivisionDto> subDivision;

	

}
