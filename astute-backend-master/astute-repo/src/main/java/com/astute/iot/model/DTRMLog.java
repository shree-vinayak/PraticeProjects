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
public class DTRMLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String deviceNumber;
	private String password;
	private String requestType;
	private String dateTime;
	private Float voltRphase;
	private Float voltYphase;
	private Float VoltBphase;
	private Float currentRphase;
	private Float currentYphase;
	private Float currentBphase;
	private Float pfRphase;
	private Float pfYphase;
	private Float pfBphase;
	private Float frequency;
	private Float energyKwhI;
	private Float energyKwhE;
	private Float energyKVAhI;
	private Float energyKVAhE;
	private Float activePower;
	private Float reactivePoweR;
	private Float apparentPower;
	private Float activeTotalIE;
	private Float cumulativeMD;
	private Float thd_rPower;
	private Float thd_yPower;
	private Float thd_bPower;
	private Float temperature;
}
