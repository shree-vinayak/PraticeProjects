package com.astute.iot.model;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;

@Entity
@Table
@Data
public class DtaMFM {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	// Sequence of the meter.
	private int sn;
	private TripStatus tripStatus;
	private FaultStatus faultStatus;
	private VcbStatus vcbStatus;
	private Float vltPhY;
	private Float PwrAcR;
	private Float PwrReB;
	private Float PwrAcT;
	private Float PwrAcY;
	private Float PwrApB;
	private Float dmMdIm;
	private Float PwrReR;
	private Float PwrReT;
	private Float curPhY;
	private Float PwrApY;
	private Float dmMdEx;
	private Float PwrApR;
	private Float PwrReY;
	private Float PfAvrg;
	private Float curLnY;
	private Float curLnR;
	private Float frAvHz;
	private Float vltPhB;
	private Float curPhR;
	private Float PwrAcB;
	private Float PwrApp;
	private Float curLnB;
	private Float enKWhE;
	private Float enKWhI;
	private Float vltPhR;
	private Float curPhB;
	private Integer id_cbism_substation_log;
	@CreationTimestamp
	private LocalDateTime timestamp;
}
