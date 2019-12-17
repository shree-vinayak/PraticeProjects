package com.astute.iot.dto;

import lombok.Data;

@Data
public class AlarmsDto {
    private Integer wta;

    private Integer wtt;

    private Integer ota;

    private Integer ott;

    private Integer bRelayAlarm;

    private Integer bRelayTrip;

    private Integer overloading;
}
