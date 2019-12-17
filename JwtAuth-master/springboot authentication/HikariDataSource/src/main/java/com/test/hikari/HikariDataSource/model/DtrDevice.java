package com.test.hikari.HikariDataSource.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table
public class DtrDevice {

	@Id
	@GeneratedValue
	@Column(name = "deviceId")
	private int deviceId;

	@Column(name = "simNumber")
	private String simNumber;

	@Column(name = "vendor")
	private String vendor;

	@OneToMany(fetch = FetchType.LAZY, targetEntity = DtrDtrDeviceMapping.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "dtrDeviceId", referencedColumnName = "deviceId")
	private Set<DtrDtrDeviceMapping> children;

	public int getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(int deviceId) {
		this.deviceId = deviceId;
	}

	public String getSimNumber() {
		return simNumber;
	}

	public void setSimNumber(String simNumber) {
		this.simNumber = simNumber;
	}

	public String getVendor() {
		return vendor;
	}

	public void setVendor(String vendor) {
		this.vendor = vendor;
	}

	public Set<DtrDtrDeviceMapping> getChildren() {
		return children;
	}

	public void setChildren(Set<DtrDtrDeviceMapping> children) {
		this.children = children;
	}

}
