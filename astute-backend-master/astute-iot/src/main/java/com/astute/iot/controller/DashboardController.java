package com.astute.iot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.astute.iot.dto.AlarmsDto;
import com.astute.iot.dto.UrgentAlarmsDto;
import com.astute.iot.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;
    
/*
    @RequestMapping(method = RequestMethod.GET, value = "/ssdevicemappings", produces = "application/json")
    public ResponseEntity<List<SubstationDeviceMappingDto>> getAllActiveSubstationDeviceMapping(){
        final List<SubstationDeviceMappingDto> substationDeviceMappings = dashboardService.getAllActiveSubstationDeviceMapping();
        return new ResponseEntity<List<SubstationDeviceMappingDto>>(substationDeviceMappings, HttpStatus.OK);
    }
*/

    @RequestMapping(method = RequestMethod.GET, value = "/activesubstations")
    public ResponseEntity<Integer> getAllActiveSubstationsCount() {
    	return new ResponseEntity<Integer>(dashboardService.getAllActiveSubstationsCount(), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/activedevices")
    public ResponseEntity<Integer> getAllActiveDevicesCount() {
    	return new ResponseEntity<Integer>(dashboardService.getAllActiveDevicesCount(), HttpStatus.OK);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/totalptrcapacity")
    public ResponseEntity<Long> getCapacitySumOfAllPtr() {
    	return new ResponseEntity<Long>(dashboardService.getCapacitySumOfAllPtr(), HttpStatus.OK);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/runningloadMVA")
    public ResponseEntity<Long> getTotalRunningLoadPtrMVA() {
        return new ResponseEntity<Long>(dashboardService.getTotalRunningLoadPtrMVA(), HttpStatus.OK);
    }
    
    @RequestMapping(method = RequestMethod.GET, value = "/runningloadAMP")
    public ResponseEntity<Long> getTotalRunningLoadPtrAMP() {
        return new ResponseEntity<Long>(dashboardService.getTotalRunningLoadPtrAMP(), HttpStatus.OK);
    }

    @GetMapping(value = "/alarms")
    public ResponseEntity<AlarmsDto> getAlarms(){
        AlarmsDto alarmsDto = dashboardService.getAlarms();
        return new ResponseEntity<AlarmsDto>(alarmsDto, HttpStatus.OK);
    }

    @GetMapping(value = "/urgentalarms")
    public ResponseEntity<List<UrgentAlarmsDto>> getUrgentAlarms(){
        List<UrgentAlarmsDto> urgentAlarmsDtos = dashboardService.getUrgentAlarms();
        return new ResponseEntity<List<UrgentAlarmsDto>>(urgentAlarmsDtos, HttpStatus.OK);
    }
}
