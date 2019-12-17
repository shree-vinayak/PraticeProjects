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
@Table(name = "ehv_ss")
@Data
@EntityListeners(AuditingEntityListener.class)
public class EhvSsDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer ehvSsId;

	private String name;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = EhvSsCircleMappingDto.class)
	@JoinColumn(name = "ehvSsId", referencedColumnName = "ehvSsId")
	private List<EhvSsCircleMappingDto> ehvSsCircleMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Line33kvDto.class)
	@JoinColumn(name = "ehvSsId", referencedColumnName = "ehvSsId")
	private List<Line33kvDto> line33kv;

}
