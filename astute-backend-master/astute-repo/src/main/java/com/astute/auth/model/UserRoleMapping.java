package com.astute.auth.model;

import javax.persistence.Column;
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
@Table(name = "user_role_mapping")
@Data
@EntityListeners(AuditingEntityListener.class)
public class UserRoleMapping extends Auditable<String> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userRoleMappingId;

	@Column(name = "username")
	private String username;

	@Column(name = "role")
	private String role;

	@Column(name = "id")
	private Integer id;

}
