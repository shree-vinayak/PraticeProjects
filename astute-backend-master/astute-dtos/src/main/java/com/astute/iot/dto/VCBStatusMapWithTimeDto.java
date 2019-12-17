package com.astute.iot.dto;

import java.time.LocalDateTime;
import java.util.HashMap;

import lombok.Data;

@Data
public class VCBStatusMapWithTimeDto {
	private HashMap<Integer, VCBStatus> statusMap;
	private LocalDateTime timestamp;
}
