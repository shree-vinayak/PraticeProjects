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
@Table(name = "pole_device")
@Data
@EntityListeners(AuditingEntityListener.class)
public class PoleDeviceDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer poleDeviceId;

	private Long number;

	private Integer vendorId;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = PolePoleDeviceMappingDto.class)
	@JoinColumn(name = "poleDeviceId", referencedColumnName = "poleDeviceId")
	private List<PolePoleDeviceMappingDto> polePoleDeviceMapping;

	private Date installationDate;

	private Long simNumber;

	private Long mobileNumber;

	private String telecomOperator;

	private String terminal;

}
