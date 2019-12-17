package com.test.hikari.HikariDataSource.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class DtrDtrDeviceMapping {

	@Id
	@GeneratedValue
	@Column(name="mappingId")
	private int id;

	@Column(name = "dtrDtrId")
	private int dtrId;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getDtrId() {
		return dtrId;
	}

	public void setDtrId(int dtrId) {
		this.dtrId = dtrId;
	}

}
