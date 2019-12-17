package com.subscription.service.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "data_source_properties")
public class DataSourceProperties {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	@Column(name = "host")
	private String host;

	@Column(name = "port")
	public Integer port;

	@Column(name = "db_name")
	public String dbName;

	@Column(name = "db_username")
	public String dbUsername;

	@Column(name = "db_password")
	public String dbPassword;
	
	@Column(name = "user_inf_id")
	public String userInfId;
	
	@Column(name = "url")
	public String url;
	
	
	@Column(name = "created_at")
	@Temporal(TemporalType.TIMESTAMP)
	public Date createdAt;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getDbName() {
		return dbName;
	}

	public void setDbName(String dbName) {
		this.dbName = dbName;
	}

	public String getDbUsername() {
		return dbUsername;
	}

	public void setDbUsername(String dbUsername) {
		this.dbUsername = dbUsername;
	}

	public String getDbPassword() {
		return dbPassword;
	}

	public void setDbPassword(String dbPassword) {
		this.dbPassword = dbPassword;
	}

	public Integer getPort() {
		return port;
	}

	public void setPort(Integer port) {
		this.port = port;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getUserInfId() {
		return userInfId;
	}

	public void setUserInfId(String userInfId) {
		this.userInfId = userInfId;
	}

}
