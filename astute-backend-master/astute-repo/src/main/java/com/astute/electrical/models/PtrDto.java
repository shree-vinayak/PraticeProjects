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
@Table(name = "ptr")
@Data
@EntityListeners(AuditingEntityListener.class)
public class PtrDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer ptrId;

	private String name;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Line33kvPtrMappingDto.class)
	@JoinColumn(name = "ptrId", referencedColumnName = "ptrId")
	private List<Line33kvPtrMappingDto> line33kvPtrMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Feeder11kvPtrMappingDto.class)
	@JoinColumn(name = "ptrId", referencedColumnName = "ptrId")
	private List<Feeder11kvPtrMappingDto> feeder11kvPtrMapping;

	private Integer substationId;

	private String capacity;

	private String make;

	private Integer yearOfManufacturing;

}