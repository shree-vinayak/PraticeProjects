package com.astute.iot.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import com.astute.iot.dto.CbismSubstationLogDto;
import com.astute.iot.dto.DtaMFMDto;
import com.astute.iot.dto.LiveDataDto;
import com.astute.iot.dto.VCBStatus;
import com.astute.iot.dto.VCBStatusMapWithTimeDto;
import com.astute.iot.model.CbismSubstationLog;
import com.astute.iot.model.DtaMFM;
import com.astute.iot.model.VcbStatus;
import com.astute.iot.repository.CbismSubstationLogRepository;
import com.astute.iot.repository.DailyOutageRepository;
import com.astute.iot.util.Util;
import com.astute.report.model.DailyOutage;

@Service
public class CbismSubstationLogServiceImpl implements CbismSubstationLogService {

	@Autowired
	private CbismSubstationLogRepository cbismSubstationLogRepo;

	@Autowired
	private Util util;

	@Autowired
	private SMSService smsService;

	@Autowired
	private DailyOutageRepository dailyOutageRepository;

	@Autowired
	private EmailService emailService;

	// HashMap which stores the live status of all VCB's corresponding to a sSDevice
	private HashMap<String, HashMap<Integer, VCBStatus>> ssDeviceVcbStatus = new HashMap<>();
	private HashMap<String, LocalDateTime> timestampMap = new HashMap<>();

	private CbismSubstationLog createLogModelFromDto(CbismSubstationLogDto logDto) {
		CbismSubstationLog cbismSubstationLog = new CbismSubstationLog();
		List<DtaMFM> setOfDtaMFMs = new ArrayList<>();
		int sn = 1;
		for (DtaMFMDto dtaMFMDto : logDto.getDtaMFM()) {
			DtaMFM dtaMFM = new DtaMFM();
			dtaMFM.setVcbStatus(determineVcbStatus(logDto.getVcbStt(), sn - 1));
			dtaMFM.setSn(sn);
			sn += 1;
			dtaMFM.setVltPhY(util.hexToIEEE754(dtaMFMDto.getVltPhY()));
			dtaMFM.setPwrAcR(util.hexToIEEE754(dtaMFMDto.getPwrAcR()));
			dtaMFM.setPwrReB(util.hexToIEEE754(dtaMFMDto.getPwrReB()));
			dtaMFM.setPwrAcT(util.hexToIEEE754(dtaMFMDto.getPwrAcT()));
			dtaMFM.setPwrAcY(util.hexToIEEE754(dtaMFMDto.getPwrAcY()));
			dtaMFM.setPwrApB(util.hexToIEEE754(dtaMFMDto.getPwrApB()));
			dtaMFM.setDmMdIm(util.hexToIEEE754(dtaMFMDto.getDmMdIm()));
			dtaMFM.setPwrReR(util.hexToIEEE754(dtaMFMDto.getPwrReR()));
			dtaMFM.setPwrReT(util.hexToIEEE754(dtaMFMDto.getPwrReT()));
			dtaMFM.setCurPhY(util.hexToIEEE754(dtaMFMDto.getCurPhY()));
			dtaMFM.setPwrApY(util.hexToIEEE754(dtaMFMDto.getPwrApY()));
			dtaMFM.setDmMdEx(util.hexToIEEE754(dtaMFMDto.getDmMdEx()));
			dtaMFM.setPwrApR(util.hexToIEEE754(dtaMFMDto.getPwrApR()));
			dtaMFM.setPwrReY(util.hexToIEEE754(dtaMFMDto.getPwrReY()));
			dtaMFM.setPfAvrg(util.hexToIEEE754(dtaMFMDto.getPfAvrg()));
			dtaMFM.setCurLnY(util.hexToIEEE754(dtaMFMDto.getCurLnY()));
			dtaMFM.setCurLnR(util.hexToIEEE754(dtaMFMDto.getCurLnR()));
			dtaMFM.setFrAvHz(util.hexToIEEE754(dtaMFMDto.getFrAvHz()));
			dtaMFM.setVltPhB(util.hexToIEEE754(dtaMFMDto.getVltPhB()));
			dtaMFM.setCurPhR(util.hexToIEEE754(dtaMFMDto.getCurPhR()));
			dtaMFM.setPwrAcB(util.hexToIEEE754(dtaMFMDto.getPwrAcB()));
			dtaMFM.setPwrApp(util.hexToIEEE754(dtaMFMDto.getPwrApp()));
			dtaMFM.setCurLnB(util.hexToIEEE754(dtaMFMDto.getCurLnB()));
			dtaMFM.setEnKWhE(util.hexToIEEE754(dtaMFMDto.getEnKWhE()));
			dtaMFM.setEnKWhI(util.hexToIEEE754(dtaMFMDto.getEnKWhI()));
			dtaMFM.setVltPhR(util.hexToIEEE754(dtaMFMDto.getVltPhR()));
			dtaMFM.setCurPhB(util.hexToIEEE754(dtaMFMDto.getCurPhB()));
			setOfDtaMFMs.add(dtaMFM);
		}
		cbismSubstationLog.setDevID0(logDto.getDevID0());
		cbismSubstationLog.setVcbStt(logDto.getVcbStt());
		cbismSubstationLog.setAlarms(logDto.getAlarms());
		cbismSubstationLog.setRequestType(logDto.getRequestType());
		cbismSubstationLog.setVolDC1(logDto.getVolDC1());
		cbismSubstationLog.setVltDC3(logDto.getVltDC3());
		cbismSubstationLog.setVolAC1(logDto.getVolAC1());
		cbismSubstationLog.setVltDC2(logDto.getVltDC2());
		cbismSubstationLog.setDtaMFM(setOfDtaMFMs);
		cbismSubstationLog.setRtDate(LocalDate.parse(logDto.getRtDate(), DateTimeFormatter.ofPattern("ddMMyy")));
		cbismSubstationLog.setTempC1(logDto.getTempC1());
		cbismSubstationLog.setPaswrd(logDto.getPaswrd());
		cbismSubstationLog.setRtTime(LocalTime.parse(logDto.getRtTime(), DateTimeFormatter.ofPattern("HHmmss")));

		return cbismSubstationLog;
	}

	private void checkAndInsertOutage(String binary, String ssDeviceId, Integer vcbSerialNo) {
		// Check if this is the begining or ending of an outage
		if (binary.charAt(2) == '1' && binary.charAt(3) == '0') {
			if (ssDeviceVcbStatus.containsKey(ssDeviceId)) {
				if ("ON".equals(ssDeviceVcbStatus.get(ssDeviceId).get(vcbSerialNo).getStatus())) {
					// outage begins

					DailyOutage dailyOutage = new DailyOutage();
					dailyOutage.setSsDeviceId(ssDeviceId);
					dailyOutage.setVcbSerialNumber(vcbSerialNo);
					dailyOutage.setOutageStartTime(LocalDateTime.now()); // Considering the timestamp of system rather
					// than the
					// device
					dailyOutageRepository.save(dailyOutage);
					// CBISM ALERT At 33/11KV S/s Substation_01, Feeder_01, breaker status changed
					// from OFF to ON ,at 2019-05-13 06:43:16
					// smsService
					smsService.sendSMS("CBISM ALERT At 33/11KV S/s Substation_" + ssDeviceId + ", Feeder_ "
							+ vcbSerialNo + ", breaker status changed from ON to OFF, " + "at " + LocalDateTime.now());
					// emailService
					emailService.sendEmailOFF(ssDeviceId, vcbSerialNo);
				}
			}
		} else if (binary.charAt(2) == '0' && binary.charAt(3) == '1') {
			if (ssDeviceVcbStatus.containsKey(ssDeviceId)) {
				if ("OFF".equals(ssDeviceVcbStatus.get(ssDeviceId).get(vcbSerialNo).getStatus())) {
					// outage ends
					// send SMS
					smsService.sendSMS("CBISM ALERT At 33/11KV S/s Substation_" + ssDeviceId + ", Feeder_ "
							+ vcbSerialNo + ", breaker status changed from OFF to ON, " + "at " + LocalDateTime.now());
					// send mail
					emailService.sendEmailON(ssDeviceId, vcbSerialNo);
					DailyOutage currentRow = dailyOutageRepository
							.findBySsDeviceIdAndVcbSerialNumberAndOutageEndTime(ssDeviceId, vcbSerialNo, null);
					currentRow.setOutageEndTime(LocalDateTime.now()); // Considering the timestamp of system rather than
					// the
					// device
					dailyOutageRepository.save(currentRow);
				}
			}
		}
	}

	private VcbStatus determineVcbStatus(String vcbStatusString, int i) {
		String binary = util.convertHexaToBinary(String.valueOf(vcbStatusString.charAt(i)));
		if (binary.charAt(2) == '0' && binary.charAt(3) == '1')
			return VcbStatus.ON;
		else if (binary.charAt(2) == '1' && binary.charAt(3) == '0')
			return VcbStatus.OFF;
		else
			return VcbStatus.INVALID;
	}

	private void updateVCBStatusMap(CbismSubstationLog cbismSubstationLog) {
		timestampMap.put(cbismSubstationLog.getDevID0(), cbismSubstationLog.getTimestamp());
		String vcbStatusString = cbismSubstationLog.getVcbStt();
		String ssDeviceId = cbismSubstationLog.getDevID0();
		HashMap<Integer, VCBStatus> vcbStatusMap = new HashMap<Integer, VCBStatus>();
		for (int i = 0; i < vcbStatusString.length(); i++) {
			VCBStatus vcbStatus = new VCBStatus();
			String binary = util.convertHexaToBinary(String.valueOf(vcbStatusString.charAt(i)));

			// Check for outage for that particular VCB
			checkAndInsertOutage(binary, ssDeviceId, i + 1);

			if (binary.charAt(2) == '0' && binary.charAt(3) == '1')
				vcbStatus.setStatus("ON");
			else if (binary.charAt(2) == '1' && binary.charAt(3) == '0')
				vcbStatus.setStatus("OFF");
			else
				vcbStatus.setStatus("INVALID");
			vcbStatusMap.put(i + 1, vcbStatus);
		}
		for (DtaMFM dta : cbismSubstationLog.getDtaMFM()) {
			vcbStatusMap.get(dta.getSn()).setB(dta.getCurLnB());
			vcbStatusMap.get(dta.getSn()).setR(dta.getCurLnR());
			vcbStatusMap.get(dta.getSn()).setY(dta.getCurLnY());
		}
		ssDeviceVcbStatus.put(ssDeviceId, vcbStatusMap);
	}

	@Override
	@Transactional
	public CbismSubstationLog save(CbismSubstationLogDto logDto) {
		CbismSubstationLog cbismSubstationLog = createLogModelFromDto(logDto);
		cbismSubstationLog = cbismSubstationLogRepo.save(cbismSubstationLog);
		updateVCBStatusMap(cbismSubstationLog);
		return cbismSubstationLog;
	}

	@Override
	public VCBStatusMapWithTimeDto getAllVcbStatus(String ssDeviceId) {
		if (ssDeviceVcbStatus.containsKey(ssDeviceId)) {
			VCBStatusMapWithTimeDto dto = new VCBStatusMapWithTimeDto();
			dto.setStatusMap(ssDeviceVcbStatus.get(ssDeviceId));
			dto.setTimestamp(timestampMap.get(ssDeviceId));
			return dto;
		} else {
			return null;
		}
	}

	@Override
	public String getVcbStatusBySerialNumber(String ssDeviceId, String vcbSerialNumber) {
		if (ssDeviceVcbStatus.containsKey(ssDeviceId)) {
			return ssDeviceVcbStatus.get(ssDeviceId).get(Integer.parseInt(vcbSerialNumber)).getStatus();
		} else {
			return null;
		}
	}

	@Override
	@Transactional
	public List<CbismSubstationLog> findAll() {
		return cbismSubstationLogRepo.findAll();
	}

	@Override
	public Set<String> findLiveDevicesForToday() {
		LocalDateTime startToday = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(),
				LocalDateTime.now().getDayOfMonth(), 0, 0);
		LocalDateTime endToday = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(),
				LocalDateTime.now().getDayOfMonth(), 23, 59);
		return cbismSubstationLogRepo.findDistinctDeviceIdsBetweenDates(startToday, endToday);
	}

	@Override
	public List<LiveDataDto> findLiveDataForToday(String deviceID) {
		LocalDateTime startToday = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(),
				LocalDateTime.now().getDayOfMonth(), 0, 0);
		LocalDateTime endToday = LocalDateTime.of(LocalDateTime.now().getYear(), LocalDateTime.now().getMonth(),
				LocalDateTime.now().getDayOfMonth(), 23, 59);

		Pageable pageable = PageRequest.of(0, 1);
		Object[] liveObject = cbismSubstationLogRepo.getLiveData(deviceID, startToday, endToday, pageable).get(0);

		List<LiveDataDto> result = new ArrayList<LiveDataDto>();
		LiveDataDto liveDataDto = new LiveDataDto();
		liveDataDto.setId((Integer) liveObject[0]);
		liveDataDto.setDevice_id((String) liveObject[1]);
		liveDataDto.setActive_power((Float) liveObject[2]);
		liveDataDto.setApparent_power((Float) liveObject[3]);
		liveDataDto.setReactive_power((Float) liveObject[4]);
		liveDataDto.setR_phase_current((Float) liveObject[5]);
		liveDataDto.setY_phase_current((Float) liveObject[6]);
		liveDataDto.setB_phase_current((Float) liveObject[7]);
		liveDataDto.setR_phase_voltage((Float) liveObject[8]);
		liveDataDto.setY_phase_voltage((Float) liveObject[9]);
		liveDataDto.setB_phase_voltage((Float) liveObject[10]);
		liveDataDto.setDemand_import((Float) liveObject[11]);
		liveDataDto.setDemand_export((Float) liveObject[12]);
		liveDataDto.setMeter_current_reading_kwh_import((Float) liveObject[13]);
		liveDataDto.setMeter_current_reading_kwh_export((Float) liveObject[14]);
		liveDataDto.setFrequency((Float) liveObject[15]);
		liveDataDto.setVcbStatus((VcbStatus) liveObject[16]);
		liveDataDto.setSn((Integer) liveObject[17]);
		liveDataDto.setTimestamp((LocalDateTime) liveObject[18]);
		liveDataDto.setWti((Float.parseFloat((String) liveObject[19])));
		liveDataDto.setOti((Float.parseFloat((String) liveObject[20])));
		liveDataDto.setAcVolt(Float.parseFloat((String) liveObject[22]));
		liveDataDto.setDcVolt(Float.parseFloat((String) liveObject[23]));
		liveDataDto.setPowerFactor((Float) liveObject[21]);
		result.add(liveDataDto);

		return result;
	}
}
