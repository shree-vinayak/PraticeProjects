package com.astute.iot.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.astute.electrical.models.SsDeviceDto;
import com.astute.electrical.repository.PtrDao;
import com.astute.electrical.repository.SsDeviceDao;
import com.astute.electrical.repository.SubstationDao;
//import com.astute.dao.PtrDao;
//import com.astute.dao.SsDeviceDao;
//import com.astute.dao.SubstationDao;
import com.astute.iot.dto.AlarmsDto;
import com.astute.iot.dto.UrgentAlarmsDto;
import com.astute.iot.model.CbismSubstationLog;
import com.astute.iot.model.DtaMFM;
import com.astute.iot.repository.CbismSubstationLogRepository;
import com.astute.iot.util.Util;
//import com.astute.model.SsDeviceDto;



@Service
public class DashboardServiceImpl implements DashboardService {
    @Autowired
    private CbismSubstationLogRepository cbismSubstationLogRepository;

    @Autowired
    private SubstationDao substationDao;

    @Autowired
    private SsDeviceDao ssDeviceDao;

    @Autowired
    private PtrDao ptrDao;

    @Autowired
    private Util util;

    /*
     * @Override public List<SubstationDeviceMappingDto>
     * getAllActiveSubstationDeviceMapping(){
     */
    /*
     * List<SubstationDeviceMappingDto> substationDeviceMappings =
     * substationDeviceMappingRepository.findByIsActive(true); return
     * substationDeviceMappings;
     *//*
     * return null; }
     */
    @Override
    public Integer getAllActiveSubstationsCount() {
        Integer count = substationDao.countByIsActive(true);
        return count;
    }

    @Override
    public Integer getAllActiveDevicesCount() {
        Integer count = ssDeviceDao.countByIsActive(true);
        return count;
    }

    @Override
    public Long getCapacitySumOfAllPtr() {
        Long sum = ptrDao.totalActivePtrCapacity();
        return sum;
    }

    @Override
    public Long getTotalRunningLoadPtrMVA() {
        List<SsDeviceDto> ssDeviceDtos = ssDeviceDao.findByIsActive(true);
        List<String> activeDevicesId = ssDeviceDtos.stream().map(device -> device.getNumber().toString()).collect(Collectors.toCollection(ArrayList::new));

        Long totRunningLoad = 0L;

        for (String deviceId : activeDevicesId) {
            CbismSubstationLog cbismSubstationLog = cbismSubstationLogRepository.getLatestLogByDeviceId(deviceId);
            if (cbismSubstationLog != null) {
                List<DtaMFM> dtaMFMS = cbismSubstationLog.getDtaMFM();
                for (DtaMFM dtaMFM : dtaMFMS) {
                    // Take vcb no. 2 to be the MFM
                    if (dtaMFM.getSn() == 2) {
                        totRunningLoad += dtaMFM.getPwrAcT().longValue();
                        break;
                    }
                }
            }
        }

        return totRunningLoad;
    }

    @Override
    public Long getTotalRunningLoadPtrAMP() {
        List<SsDeviceDto> ssDeviceDtos = ssDeviceDao.findByIsActive(true);
        List<String> activeDevicesId = ssDeviceDtos.stream().map(device -> device.getNumber().toString()).collect(Collectors.toCollection(ArrayList::new));

        Long totRunningLoad = 0L;

        for (String deviceId : activeDevicesId) {
            CbismSubstationLog cbismSubstationLog = cbismSubstationLogRepository.getLatestLogByDeviceId(deviceId);
            if (cbismSubstationLog != null) {
                List<DtaMFM> dtaMFMS = cbismSubstationLog.getDtaMFM();
                for (DtaMFM dtaMFM : dtaMFMS) {
                    // Take vcb no. 2 to be the MFM
                    if (dtaMFM.getSn() == 2) {
                        long curR = (dtaMFM.getCurPhR().longValue() < 0) ? 0 : dtaMFM.getCurPhR().longValue();
                        long curY = (dtaMFM.getCurPhY().longValue() < 0) ? 0 : dtaMFM.getCurPhY().longValue();
                        long curB = (dtaMFM.getCurPhB().longValue() < 0) ? 0 : dtaMFM.getCurPhB().longValue();
                        totRunningLoad += (curR + curY + curB) / 3;
                        break;
                    }
                }
            }
        }

        return totRunningLoad;
    }

    private void initializeAlarmsDto(AlarmsDto alarmsDto) {
        alarmsDto.setBRelayTrip(0);
        alarmsDto.setBRelayAlarm(0);
        alarmsDto.setOtt(0);
        alarmsDto.setOta(0);
        alarmsDto.setWtt(0);
        alarmsDto.setWta(0);
        alarmsDto.setOverloading(0);
    }

    @Override
    public AlarmsDto getAlarms() {
        AlarmsDto alarmsDto = new AlarmsDto();
        initializeAlarmsDto(alarmsDto);

        // Retrieve all the active devices
        List<SsDeviceDto> ssDeviceDtos = ssDeviceDao.findByIsActive(true);

        for (SsDeviceDto ssDeviceDto : ssDeviceDtos) {
            // Retrieve the latest log for that device
            CbismSubstationLog cbismSubstationLog = cbismSubstationLogRepository
                    .getLatestLogByDeviceId(ssDeviceDto.getNumber().toString());
            if (cbismSubstationLog != null) {
                // Check the alarms string for this device
                String alarms = cbismSubstationLog.getAlarms();

                // Check for all 3 ptr's
                for (int i = 0; i < 3; i++) {
                    String binary = util.convertHexaToBinary(String.valueOf(alarms.charAt(2 * i)))
                            .concat(util.convertHexaToBinary(String.valueOf(alarms.charAt(2 * i + 1))));

                    // Now check for alarm flags
                    checkAlarmsFlag(binary, alarmsDto);
                }
            }
        }

        return alarmsDto;
    }

    private void checkAlarmsFlag(String binary, AlarmsDto alarmsDto) {
        if (binary.charAt(7) == '1')
            alarmsDto.setWta(alarmsDto.getWta() + 1); // Winding temperature alarm
        if (binary.charAt(6) == '1')
            alarmsDto.setWtt(alarmsDto.getWtt() + 1); // Winding temparature trip
        if (binary.charAt(5) == '1')
            alarmsDto.setOta(alarmsDto.getOta() + 1); // Oil temperature alarm
        if (binary.charAt(4) == '1')
            alarmsDto.setOtt(alarmsDto.getOtt() + 1); // Oil temperature trip
        if (binary.charAt(3) == '1')
            alarmsDto.setBRelayAlarm(alarmsDto.getBRelayAlarm() + 1); // Bucholz relay alarm
        if (binary.charAt(2) == '1')
            alarmsDto.setBRelayTrip(alarmsDto.getBRelayTrip() + 1); // Bucholz relay trip
    }

    @Override
    public List<UrgentAlarmsDto> getUrgentAlarms() {
        List<UrgentAlarmsDto> urgertAlarms = new ArrayList<>();

        // Retrieve all the active devices
        List<SsDeviceDto> ssDeviceDtos = ssDeviceDao.findByIsActive(true);

        for (SsDeviceDto ssDeviceDto : ssDeviceDtos) {

            Pageable pageable = PageRequest.of(0,10);
            // Retrieve the latest log for that device
            List<CbismSubstationLog> cbismSubstationLogs = cbismSubstationLogRepository
                    .getLatest10LogByDeviceId(ssDeviceDto.getNumber().toString(), pageable);
            if (cbismSubstationLogs != null) {
                for(CbismSubstationLog cbismSubstationLog: cbismSubstationLogs){
                    // Check the alarms string for this device
                    String alarms = cbismSubstationLog.getAlarms();

                    UrgentAlarmsDto urgentAlarmsDto = new UrgentAlarmsDto();

                    AlarmsDto alarmsDto = new AlarmsDto();
                    initializeAlarmsDto(alarmsDto);
                    // Check for all 3 ptr's
                    for (int i = 0; i < 3; i++) {
                        String binary = util.convertHexaToBinary(String.valueOf(alarms.charAt(2 * i)))
                                .concat(util.convertHexaToBinary(String.valueOf(alarms.charAt(2 * i + 1))));

                        // Now check for alarm flags
                        checkAlarmsFlag(binary, alarmsDto);
                    }

                    //Set the values in the urgent alarms Dto
                    urgentAlarmsDto.setAlarms(alarmsDto);
                    urgentAlarmsDto.setSsDeviceId(ssDeviceDto.getNumber().toString());
                    urgentAlarmsDto.setTimestamp(cbismSubstationLog.getTimestamp());

                    //Now add the object to array list
                    urgertAlarms.add(urgentAlarmsDto);
                }
            }
        }

        return urgertAlarms;
    }

}
