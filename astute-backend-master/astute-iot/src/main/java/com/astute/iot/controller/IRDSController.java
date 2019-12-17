package com.astute.iot.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.astute.iot.dto.IRDSLogDto;
import com.astute.iot.model.IRDSLog;
import com.astute.iot.service.IRDSLogService;

@RestController
public class IRDSController {
	@Autowired
	private IRDSLogService irdsLogService;

	@GetMapping(value = "/irds")
	public ResponseEntity<List<IRDSLog>> getIRDS() {
		List<IRDSLog> logs = irdsLogService.findAll();
		return new ResponseEntity<List<IRDSLog>>(logs, HttpStatus.OK);
	}

	@PostMapping(value = "/irds", headers = "Accept=application/json")
	public String postIRDS(@RequestBody IRDSLogDto logDto) {
		if (logDto.getRequestType().equalsIgnoreCase("Normal")) {
			// TODO: Check and verify password
			IRDSLog savedLog = irdsLogService.save(logDto);
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
			String timestamp = formatter.format(LocalDateTime.now());
			return "!" + savedLog.getDeviceNumber() + ",0," + timestamp;
		} else {
			return "0";
		}
	}
}
