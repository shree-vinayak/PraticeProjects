package com.astute.electrical.models;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.astute.discom.models.Auditable;

import lombok.Data;

@Entity
@Table(name = "substation3kvline_mapping")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Substation33kvlineMappingDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer substation33kvlineMappingId;

	private Integer line33kvId;

	private Integer substationId;

}
