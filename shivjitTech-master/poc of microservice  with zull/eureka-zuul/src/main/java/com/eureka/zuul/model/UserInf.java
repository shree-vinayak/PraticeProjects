package com.eureka.zuul.model;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table
public class UserInf {

	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid")
	private String userId;

	@Column(name = "name")
	private String name;

	@Column(name = "password")
	private String password;

	@Column(name = "username")
	private String username;

	@OneToOne(targetEntity = Pkg.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "pkgId", referencedColumnName = "pkgId")
	private Pkg pkg;

	@Column(name = "role")
	private String role;

	@Column(name = "mobile")
	private Long mobile;

	@Column(name = "pkg_type")
	private String pkgType;

	@Column(name = "created_date")
	private LocalDateTime createdDate;

	@Column(name = "pkg_start_date")
	private LocalDateTime pkgStartDate;

	@Column(name = "pkg_exp_date")
	private LocalDateTime pkgExpDate;

	@Column(name = "status")
	private boolean status;

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
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

	public Pkg getPkg() {
		return pkg;
	}

	public void setPkg(Pkg pkg) {
		this.pkg = pkg;
	}

	public String getPkgType() {
		return pkgType;
	}

	public void setPkgType(String pkgType) {
		this.pkgType = pkgType;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public LocalDateTime getPkgStartDate() {
		return pkgStartDate;
	}

	public void setPkgStartDate(LocalDateTime pkgStartDate) {
		this.pkgStartDate = pkgStartDate;
	}

	public LocalDateTime getPkgExpDate() {
		return pkgExpDate;
	}

	public void setPkgExpDate(LocalDateTime pkgExpDate) {
		this.pkgExpDate = pkgExpDate;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

}
