package com.astute.iot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.astute.iot.dto.DTRMLogDto;
import com.astute.iot.model.DTRMLog;
import com.astute.iot.repository.DTRMLogRepository;
import com.astute.iot.util.Util;

@Service
public class DTRMLogServiceImpl implements DTRMLogService {
	@Autowired
	private DTRMLogRepository dtrmLogRepo;

	@Autowired
	Util util;

	@Override
	public DTRMLog save(DTRMLogDto logDto) {
		DTRMLog dtrmLog = new DTRMLog();
		dtrmLog.setDeviceNumber(logDto.getDeviceNumber());
		dtrmLog.setPassword(logDto.getPassword());
		dtrmLog.setRequestType(logDto.getRequestType());
		dtrmLog.setDateTime(logDto.getDateTime());
		dtrmLog.setVoltRphase(util.hexToIEEE754(logDto.getVoltRphase()));
		dtrmLog.setVoltYphase(util.hexToIEEE754(logDto.getVoltYphase()));
		dtrmLog.setVoltBphase(util.hexToIEEE754(logDto.getVoltBphase()));
		dtrmLog.setCurrentRphase(util.hexToIEEE754(logDto.getCurrentRphase()));
		dtrmLog.setCurrentYphase(util.hexToIEEE754(logDto.getCurrentYphase()));
		dtrmLog.setCurrentBphase(util.hexToIEEE754(logDto.getCurrentBphase()));
		dtrmLog.setPfRphase(util.hexToIEEE754(logDto.getPfRphase()));
		dtrmLog.setPfYphase(util.hexToIEEE754(logDto.getPfYphase()));
		dtrmLog.setPfBphase(util.hexToIEEE754(logDto.getPfBphase()));
		dtrmLog.setFrequency(util.hexToIEEE754(logDto.getFrequency()));
		dtrmLog.setEnergyKwhI(util.hexToIEEE754(logDto.getEnergyKwhI()));
		dtrmLog.setEnergyKwhE(util.hexToIEEE754(logDto.getEnergyKwhE()));
		dtrmLog.setEnergyKVAhI(util.hexToIEEE754(logDto.getEnergyKVAhI()));
		dtrmLog.setEnergyKVAhE(util.hexToIEEE754(logDto.getEnergyKVAhE()));
		dtrmLog.setActivePower(util.hexToIEEE754(logDto.getActivePower()));
		dtrmLog.setReactivePoweR(util.hexToIEEE754(logDto.getReactivePoweR()));
		dtrmLog.setApparentPower(util.hexToIEEE754(logDto.getApparentPower()));
		dtrmLog.setActiveTotalIE(util.hexToIEEE754(logDto.getActiveTotalIE()));
		dtrmLog.setCumulativeMD(util.hexToIEEE754(logDto.getCumulativeMD()));
		dtrmLog.setThd_rPower(util.hexToIEEE754(logDto.getThd_rPower()));
		dtrmLog.setThd_yPower(util.hexToIEEE754(logDto.getThd_yPower()));
		dtrmLog.setThd_bPower(util.hexToIEEE754(logDto.getThd_bPower()));
		dtrmLog.setTemperature(util.hexToIEEE754(logDto.getTemperature()));
		dtrmLog = dtrmLogRepo.save(dtrmLog);
		return dtrmLog;
	}

	@Override
	public List<DTRMLog> findAll() {
		return dtrmLogRepo.findAll();
	}

}
