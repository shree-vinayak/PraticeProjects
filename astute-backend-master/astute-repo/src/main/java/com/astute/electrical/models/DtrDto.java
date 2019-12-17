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
@Table(name = "dtr")
@Data
@EntityListeners(AuditingEntityListener.class)
public class DtrDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer dtrId;

	private String name;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = DtrDtrDeviceMappingDto.class)
	@JoinColumn(name = "dtrId", referencedColumnName = "dtrId")
	private List<DtrDtrDeviceMappingDto> dtrDtrDeviceMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = DtrPoleMappingDto.class)
	@JoinColumn(name = "dtrId", referencedColumnName = "dtrId")
	private List<DtrPoleMappingDto> dtrPoleMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Feeder11kvDtrMappingDto.class)
	@JoinColumn(name = "dtrId", referencedColumnName = "dtrId")
	private List<Feeder11kvDtrMappingDto> feeder11kvDtrMapping;

	private String capacity;

	private String make;

	private Integer yearOfManufacturing;

}
