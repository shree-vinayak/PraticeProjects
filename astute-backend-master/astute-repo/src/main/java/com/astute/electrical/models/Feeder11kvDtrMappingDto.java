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
@Table(name = "feeder11kv_dtr_mapping")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Feeder11kvDtrMappingDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer feeder11kvDtrMappingId;

	private Integer feeder11kvId;;

	private Integer dtrId;

}
