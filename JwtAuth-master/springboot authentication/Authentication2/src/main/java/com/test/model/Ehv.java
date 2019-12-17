package com.test.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table
public class Ehv {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("id")
	private int id;

	@JsonProperty("name")
	private String name;

	@JsonProperty("ehvCircle")
	@OneToMany(fetch = FetchType.LAZY, targetEntity = EhvCircle.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "ehvid", referencedColumnName = "id")
	private Set<EhvCircle> ehvCircle;

	

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Set<EhvCircle> getEhvCircle() {
		return ehvCircle;
	}

	public void setEhvCircle(Set<EhvCircle> ehvCircle) {
		this.ehvCircle = ehvCircle;
	}

	
}
