package com.astute.iot.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class IRDSLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String deviceNumber;
	private String password;
	private String requestType;
	private Float LineVoltageR;
	private Float LineVoltageY;
	private Float LineVoltageB;
	private Float terminalCode;
	private Float relayStatus;
	private Float LineCurrent;
	private Float ActivePower;
	private Float ReactiPower;
	private Float Pf;
	private Float KWh_PhaseWise;
	private Float KWh;
	private Float KWhImp;
	private Float KWhExp;
	private Float KVAh;
	private Float KVAhImp;
	private Float KVAhExp;
}
