package com.eureka.zuul.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name ="pkg")
public class Pkg {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long pkgId;
	
	@Column(name ="pkg_name")
	private String pkgName;
	
	@Column(name ="sql_file_name")
	private String sqlFileName;
	
	@Column(name ="description")
	private String description;

	public Long getPkgId() {
		return pkgId;
	}

	public void setPkgId(Long pkgId) {
		this.pkgId = pkgId;
	}

	public String getPkgName() {
		return pkgName;
	}

	public void setPkgName(String pkgName) {
		this.pkgName = pkgName;
	}

	public String getSqlFileName() {
		return sqlFileName;
	}

	public void setSqlFileName(String sqlFileName) {
		this.sqlFileName = sqlFileName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
