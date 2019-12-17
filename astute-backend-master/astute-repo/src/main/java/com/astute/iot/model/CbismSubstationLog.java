package com.astute.iot.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;

@Entity
@Table
@Data
public class CbismSubstationLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	// TODO -----------------
	// @ManyToOne()
	// @JoinColumn(name = "id", referencedColumnName = "id")
	private String devID0;
	private String vcbStt;
	private String alarms;
	private String requestType;
	private String volDC1;
	private String vltDC3;
	private String volAC1;
	private String vltDC2;

	@OneToMany(fetch = FetchType.LAZY, targetEntity = DtaMFM.class, cascade = CascadeType.ALL)
	@JoinColumn(name = "id_cbism_substation_log", referencedColumnName = "id")
	private List<DtaMFM> dtaMFM;

	private LocalDate rtDate;
	private String TempC1;
	private String paswrd;
	private LocalTime rtTime;
	@CreationTimestamp
	private LocalDateTime timestamp;
}
