package com.astute.iot.service;

import com.astute.iot.dto.AlarmsDto;
import com.astute.iot.dto.UrgentAlarmsDto;

import java.util.List;

public interface DashboardService {
//    public List<SubstationDeviceMappingDto> getAllActiveSubstationDeviceMapping();
    
    Integer getAllActiveSubstationsCount();
    
    Integer getAllActiveDevicesCount();
    
    Long getCapacitySumOfAllPtr();
    
    Long getTotalRunningLoadPtrMVA();
    
    Long getTotalRunningLoadPtrAMP();

    AlarmsDto getAlarms();

    List<UrgentAlarmsDto> getUrgentAlarms();
}
