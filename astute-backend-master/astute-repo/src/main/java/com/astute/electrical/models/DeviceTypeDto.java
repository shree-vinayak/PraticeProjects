package com.astute.electrical.models;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "device_type")
@Data
public class DeviceTypeDto implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer deviceTypeId;

	@Column(name = "type")
	private String type;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = VendorDto.class)
	@JoinColumn(name = "deviceTypeId", referencedColumnName = "deviceTypeId", updatable = false)
	private List<VendorDto> vendor;

}
