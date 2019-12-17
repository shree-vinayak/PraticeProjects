package com.astute.iot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.astute.iot.dto.IRDSLogDto;
import com.astute.iot.model.IRDSLog;
import com.astute.iot.repository.IRDSLogRepository;
import com.astute.iot.util.Util;

@Service
public class IRDSLogServiceImpl implements IRDSLogService {
	@Autowired
	private IRDSLogRepository irdsLogRepo;

	@Autowired
	Util util;

	@Override
	public IRDSLog save(IRDSLogDto logDto) {
		IRDSLog irdsLog = new IRDSLog();
		irdsLog.setDeviceNumber(logDto.getDeviceNumber());
		irdsLog.setPassword(logDto.getPassword());
		irdsLog.setRequestType(logDto.getRequestType());
		irdsLog.setLineVoltageR(util.hexToIEEE754(logDto.getLineVoltageR()));
		irdsLog.setLineVoltageY(util.hexToIEEE754(logDto.getLineVoltageY()));
		irdsLog.setLineVoltageB(util.hexToIEEE754(logDto.getLineVoltageB()));
		irdsLog.setTerminalCode(util.hexToIEEE754(logDto.getTerminalCode()));
		irdsLog.setRelayStatus(util.hexToIEEE754(logDto.getRelayStatus()));
		irdsLog.setLineCurrent(util.hexToIEEE754(logDto.getLineCurrent()));
		irdsLog.setActivePower(util.hexToIEEE754(logDto.getActivePower()));
		irdsLog.setReactiPower(util.hexToIEEE754(logDto.getReactiPower()));
		irdsLog.setPf(util.hexToIEEE754(logDto.getPf()));
		irdsLog.setKWh_PhaseWise(util.hexToIEEE754(logDto.getKWh_PhaseWise()));
		irdsLog.setKWh(util.hexToIEEE754(logDto.getKWh()));
		irdsLog.setKWhImp(util.hexToIEEE754(logDto.getKWhImp()));
		irdsLog.setKWhExp(util.hexToIEEE754(logDto.getKWhExp()));
		irdsLog.setKVAh(util.hexToIEEE754(logDto.getKVAh()));
		irdsLog.setKVAhImp(util.hexToIEEE754(logDto.getKVAhImp()));
		irdsLog.setKVAhExp(util.hexToIEEE754(logDto.getKVAhExp()));
		irdsLog = irdsLogRepo.save(irdsLog);
		return irdsLog;
	}

	@Override
	public List<IRDSLog> findAll() {
		return irdsLogRepo.findAll();
	}

}
