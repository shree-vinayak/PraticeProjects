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
@Table(name = "vendor")
@Data
@EntityListeners(AuditingEntityListener.class)
public class VendorDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer vendorId;

	private Integer deviceTypeId;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = SsDeviceDto.class)
	@JoinColumn(name = "vendorId", referencedColumnName = "vendorId", updatable = false)
	private List<SsDeviceDto> ssDevice;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = PoleDeviceDto.class)
	@JoinColumn(name = "vendorId", referencedColumnName = "vendorId", updatable = false)
	private List<PoleDeviceDto> poleDevice;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = DtrDeviceDto.class)
	@JoinColumn(name = "vendorId", referencedColumnName = "vendorId", updatable = false)
	private List<DtrDeviceDto> dtrDevice;

	private String vendorName;

}
