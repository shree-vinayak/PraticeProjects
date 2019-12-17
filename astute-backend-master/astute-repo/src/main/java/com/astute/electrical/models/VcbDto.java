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
@Table(name = "vcb")
@Data
@EntityListeners(AuditingEntityListener.class)
public class VcbDto extends Auditable<String> implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer vcbId;

	private String name;

	private String type;

	private Integer index;

	private Integer ssDeviceId;

}
