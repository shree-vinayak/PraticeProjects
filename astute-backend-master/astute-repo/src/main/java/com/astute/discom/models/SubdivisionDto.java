
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

/**
 * Subdivision
 */
@Entity
@Table(name = "subdivision")
@Data
@EntityListeners(AuditingEntityListener.class)
public class SubdivisionDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idSubdivision;

	@Column(name = "idCircle", nullable = false)
	private Integer idDivision;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "contact", nullable = false)
	private Long contact;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commonAddressId", referencedColumnName = "idAddress", nullable = false)
	private AddressDto address;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = ZoneDto.class)
	@JoinColumn(name = "idSubdivision", referencedColumnName = "idSubdivision", updatable = false)
	private List<ZoneDto> zone;

}
