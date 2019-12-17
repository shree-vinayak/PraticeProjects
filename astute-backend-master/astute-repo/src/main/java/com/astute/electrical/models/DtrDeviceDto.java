package com.astute.electrical.models;

import java.io.Serializable;
import java.util.Date;
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
@Table(name = "dtr_device")
@Data
@EntityListeners(AuditingEntityListener.class)
public class DtrDeviceDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer dtrDeviceId;

	private Long number;

	private Integer vendorId;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = DtrDtrDeviceMappingDto.class)
	@JoinColumn(name = "dtrDeviceId", referencedColumnName = "dtrDeviceId")
	private List<DtrDtrDeviceMappingDto> dtrDtrDeviceMapping;

	private Date installationDate;

	private Long simNumber;

	private Long mobileNumber;

	private String telecomOperator;

}
