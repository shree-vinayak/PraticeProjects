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
public class Dtr {

	@Id
	@GeneratedValue
	@Column(name = "dtrId")
	private int dtrId;

	@Column(name = "dtrName")
	private String dtrName;

	@Column(name = "capacity")
	private String capacity;
	
	@OneToMany(fetch=FetchType.LAZY, targetEntity=DtrDtrDeviceMapping.class, cascade=CascadeType.ALL)
	@JoinColumn(name = "dtrDtrId", referencedColumnName="dtrId")
	private Set<DtrDtrDeviceMapping> children;

	public int getDtrId() {
		return dtrId;
	}

	public void setDtrId(int dtrId) {
		this.dtrId = dtrId;
	}

	public String getDtrName() {
		return dtrName;
	}

	public void setDtrName(String dtrName) {
		this.dtrName = dtrName;
	}

	public String getCapacity() {
		return capacity;
	}

	public void setCapacity(String capacity) {
		this.capacity = capacity;
	}

	public String getMake() {
		return make;
	}

	public void setMake(String make) {
		this.make = make;
	}

	@Column(name = "make")
	private String make;
}
