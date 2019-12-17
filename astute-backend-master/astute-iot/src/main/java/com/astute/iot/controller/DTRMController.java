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

import com.astute.iot.dto.DTRMLogDto;
import com.astute.iot.model.DTRMLog;
import com.astute.iot.service.DTRMLogService;

@RestController
public class DTRMController {
	@Autowired
	private DTRMLogService dtrmLogService;

	@GetMapping(value = "/dtrm")
	public ResponseEntity<List<DTRMLog>> getDTRM() {
		List<DTRMLog> logs = dtrmLogService.findAll();
		return new ResponseEntity<List<DTRMLog>>(logs, HttpStatus.OK);
	}

	@PostMapping(value = "/dtrm", headers = "Accept=application/json")
	public String postDTRM(@RequestBody DTRMLogDto logDto) {
		if (logDto.getRequestType().equalsIgnoreCase("Normal")) {
			// TODO: Check and verify password
			DTRMLog savedLog = dtrmLogService.save(logDto);
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
			String timestamp = formatter.format(LocalDateTime.now());
			return "!" + savedLog.getDeviceNumber() + ",0," + timestamp + "%";
		} else {
			return "0";
		}
	}
}
