package com.test.model;
// Generated 30 May, 2019 7:52:16 PM by Hibernate Tools 5.0.6.Final

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Line33kv generated by hbm2java
 */
@Entity
@Table(name = "line33kv", catalog = "usersdb")
public class Line33kv implements java.io.Serializable {

	private Integer id;
	private Ehv ehv;
	private String name;

	public Line33kv() {
	}

	public Line33kv(Ehv ehv, String name) {
		this.ehv = ehv;
		this.name = name;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)

	@Column(name = "id", unique = true, nullable = false)
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "ehvid")
	@JsonIgnore
	public Ehv getEhv() {
		return this.ehv;
	}

	public void setEhv(Ehv ehv) {
		this.ehv = ehv;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Line33kv [id=" + id + ", ehv=" + ehv + ", name=" + name + "]";
	}

	
	
}
