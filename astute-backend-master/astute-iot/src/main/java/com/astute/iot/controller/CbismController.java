package com.astute.iot.controller;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.astute.iot.dto.CbismSubstationLogDto;
import com.astute.iot.dto.LiveDataDto;
import com.astute.iot.dto.VCBStatusMapWithTimeDto;
import com.astute.iot.model.CbismSubstationLog;
import com.astute.iot.service.CbismSubstationLogService;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CbismController {

	@Autowired
	private Logger logger;

	@Autowired
	private CbismSubstationLogService cbismSubstationLogService;

//	@GetMapping(value = "/cbism")
//	public ResponseEntity<List<CbismSubstationLog>> getCbism() {
//		List<CbismSubstationLog> logs = cbismSubstationLogService.findAll();
//		return new ResponseEntity<List<CbismSubstationLog>>(logs, HttpStatus.OK);
//	}

	@RequestMapping(method = RequestMethod.POST, value = "/cbism", produces = MediaType.TEXT_PLAIN_VALUE)
	public String postCbism(@RequestBody String logDtoString) {
		logger.info(logDtoString);
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			String s = java.net.URLDecoder.decode(logDtoString, "UTF-8");
			CbismSubstationLogDto logDto = objectMapper.readValue(s, CbismSubstationLogDto.class);
			logger.info(logDto.toString());
			if (logDto.getRequestType().equalsIgnoreCase("Normal")) {
				// TODO: Check and verify password, Skip As of Now
				CbismSubstationLog savedLog = cbismSubstationLogService.save(logDto);
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmm");
				String timestamp = formatter.format(savedLog.getTimestamp());
				return "!" + savedLog.getDevID0() + ",0," + timestamp + "%";
			} else {
				return "0";
			}
		} catch (IOException e) {
			System.out.println(e.getMessage());
			return "0";
		}
	}

	@GetMapping(value = "/vcbstatus/{ssDeviceId}", produces = "application/json")
	public ResponseEntity<VCBStatusMapWithTimeDto> getVcbStatusBySerialNumber(

			@PathVariable("ssDeviceId") String ssDeviceId) {
		final VCBStatusMapWithTimeDto vcbStatus = cbismSubstationLogService.getAllVcbStatus(ssDeviceId);
		return new ResponseEntity<VCBStatusMapWithTimeDto>(vcbStatus, HttpStatus.OK);
	}

	@GetMapping(value = "/livedevices", produces = "application/json")
	public ResponseEntity<Set<String>> getTodaysDevId0() {
		final Set<String> devId0 = cbismSubstationLogService.findLiveDevicesForToday();
		return new ResponseEntity<Set<String>>(devId0, HttpStatus.OK);
	}

	@GetMapping(value = "/livedata/{deviceId}", produces = "application/json")
	public ResponseEntity<List<LiveDataDto>> getLiveData0(@PathVariable("deviceId") String deviceId) {
		final List<LiveDataDto> liveData = cbismSubstationLogService.findLiveDataForToday(deviceId);
		return new ResponseEntity<List<LiveDataDto>>(liveData, HttpStatus.OK);
	}

	@GetMapping(value = "/vcbstatus/{ssDeviceId}/{serialNo}", produces = "text/plain")
	public ResponseEntity<String> getAllVcbStatus(@PathVariable("ssDeviceId") String ssDeviceId,

			@PathVariable("serialNo") String vcbSerialNumber) {
		final String vcbStatus = cbismSubstationLogService.getVcbStatusBySerialNumber(ssDeviceId, vcbSerialNumber);
		return new ResponseEntity<String>(vcbStatus, HttpStatus.OK);
	}

}
