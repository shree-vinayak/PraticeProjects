package com.astute.iot.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table
@Data
public class SMSConfig {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String mobiles;
	private String authKey;
	private String route;
	private String country;
	private String sender;
	private String host;
	private String email;
}
