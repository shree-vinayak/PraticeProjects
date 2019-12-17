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
@Table(name = "ss_device")
@Data
@EntityListeners(AuditingEntityListener.class)
public class SsDeviceDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer ssDeviceId;

	private Long number;

	private Integer vendorId;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = SubstationDeviceMappingDto.class)
	@JoinColumn(name = "ssDeviceId", referencedColumnName = "ssDeviceId")
	private List<SubstationDeviceMappingDto> substationDeviceMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = VcbDto.class)
	@JoinColumn(name = "ssDeviceId", referencedColumnName = "ssDeviceId")
	private List<VcbDto> vcb;

	private Date installationDate;

	private Long simNumber;

	private Long mobileNumber;

	private String telecomOperator;

	

}