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
@Table(name = "pole")
@Data
@EntityListeners(AuditingEntityListener.class)
public class PoleDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer poleId;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = PolePoleDeviceMappingDto.class)
	@JoinColumn(name = "poleId", referencedColumnName = "poleId", updatable = false)
	private List<PolePoleDeviceMappingDto> polePoleDeviceMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = DtrPoleMappingDto.class)
	@JoinColumn(name = "poleId", referencedColumnName = "poleId")
	private List<DtrPoleMappingDto> dtrPoleMapping;

	private String number;
}