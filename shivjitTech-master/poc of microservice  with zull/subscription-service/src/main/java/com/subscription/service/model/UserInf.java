package com.subscription.service.model;

import java.time.LocalDateTime;

public class UserInf {

	private String userId;

	private String name;

	private String password;

	private String username;

	private Pkg pkg;

	private String role;

	private Long mobile;

	private String pkgType;

	private LocalDateTime createdDate;

	private LocalDateTime pkgStartDate;

	private LocalDateTime pkgExpDate;

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
