package com.test.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table
public class EhvCircle {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("id")
	private int id;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	@JsonProperty("circleid")
	private int circleid;

	public int getCircleid() {
		return circleid;
	}

	public void setCircleid(int circleid) {
		this.circleid = circleid;
	}
	
//	@ManyToOne
//    @JoinColumn(name = "ehvid")
//	private Ehv ehv;
//
//	
//	public Ehv getEhv() {
//		return ehv;
//	}
//
//	public void setEhv(Ehv ehv) {
//		this.ehv = ehv;
//	}
	
	

}
