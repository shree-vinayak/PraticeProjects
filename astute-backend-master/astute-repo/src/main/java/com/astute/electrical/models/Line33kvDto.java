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
@Table(name = "line33kv")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Line33kvDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer line33kvId;

	private String name;

	private Integer ehvSsId;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Substation33kvlineMappingDto.class)
	@JoinColumn(name = "line33kvId", referencedColumnName = "line33kvId")
	private List<Substation33kvlineMappingDto> substation33kvlineMapping;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = Line33kvPtrMappingDto.class)
	@JoinColumn(name = "line33kvId", referencedColumnName = "line33kvId")
	private List<Line33kvPtrMappingDto> line33kvPtrMapping;

}
