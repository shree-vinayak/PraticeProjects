
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
import javax.validation.constraints.Email;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;

@Entity
@Table(name = "company")
@Data
@EntityListeners(AuditingEntityListener.class)
public class CompanyDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "logo", nullable = false)
	private String logo;

	@Column(name = "initials", nullable = false)
	private String initials;

	@Email
	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "contact", nullable = false)
	private Long contact;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commonAddressId", referencedColumnName = "idAddress", nullable = false)
	private AddressDto addressDto;

	@OneToOne(targetEntity = StateDto.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "stateId", referencedColumnName = "stateId", updatable = false, nullable = false)
	private StateDto stateDto;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = RegionDto.class)
	@JoinColumn(name = "idCompany", referencedColumnName = "id", updatable = false)
	private List<RegionDto> regionDto;

}
