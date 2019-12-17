package com.astute.iot.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrgentAlarmsDto {
    private String ssDeviceId;

    private AlarmsDto alarms;

    private LocalDateTime timestamp;
}
