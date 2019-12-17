package com.astute.auth.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.astute.discom.models.AddressDto;
import com.astute.discom.models.StateDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.astute.discom.models.Auditable;

@Entity
@Table
//@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
@EntityListeners(AuditingEntityListener.class)
public class UserInf extends Auditable<String> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId;

	@Column(name = "name")
	private String name;

	@Column(name = "password")
	@JsonIgnore
	private String password;

	@Column(name = "username")
	private String username;

	@OneToOne(targetEntity = AddressDto.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "commonAddressId", referencedColumnName = "idAddress")
	@JsonIgnore
	private AddressDto address;

	@OneToOne(targetEntity = StateDto.class, cascade = CascadeType.MERGE)
	@JoinColumn(name = "stateId", referencedColumnName = "stateId", updatable = false)
	private StateDto state;

//	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, targetEntity = UserRoleMapping.class)
//	@JoinColumn(name = "userId", referencedColumnName = "userId")
//	private List<UserRoleMapping> userRoleMapping;

	@Column(name = "role")
	private String role;

	@Column(name = "mobile")
	private Long mobile;

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public AddressDto getAddress() {
		return address;
	}

	public void setAddress(AddressDto address) {
		this.address = address;
	}

	public StateDto getState() {
		return state;
	}

	public void setState(StateDto state) {
		this.state = state;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Long getMobile() {
		return mobile;
	}

	public void setMobile(Long mobile) {
		this.mobile = mobile;
	}

//	public List<UserRoleMapping> getUserRoleMapping() {
//		return userRoleMapping;
//	}
//
//	public void setUserRoleMapping(List<UserRoleMapping> userRoleMapping) {
//		this.userRoleMapping = userRoleMapping;
//	}

}
