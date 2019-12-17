package com.astute.iot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DTRMLogDto {
    @JsonProperty("deviceNumber")
    private String deviceNumber;
    @JsonProperty("password")
    private String password;
    @JsonProperty("requestType")
    private String requestType;
    @JsonProperty("dateTime")
    private String dateTime;
    @JsonProperty("voltRphase")
    private String voltRphase;
    @JsonProperty("voltYphase")
    private String voltYphase;
    @JsonProperty("voltBphase")
    private String voltBphase;
    @JsonProperty("currentRphase")
    private String currentRphase;
    @JsonProperty("currentYphase")
    private String currentYphase;
    @JsonProperty("currentBphase")
    private String currentBphase;
    @JsonProperty("pfRphase")
    private String pfRphase;
    @JsonProperty("pfYphase")
    private String pfYphase;
    @JsonProperty("pfBphase")
    private String pfBphase;
    @JsonProperty("frequency")
    private String frequency;
    @JsonProperty("energyKwhI")
    private String energyKwhI;
    @JsonProperty("energyKwhE")
    private String energyKwhE;
    @JsonProperty("energyKVAhI")
    private String energyKVAhI;
    @JsonProperty("energyKVAhE")
    private String energyKVAhE;
    @JsonProperty("activePower")
    private String activePower;
    @JsonProperty("reactivePoweR")
    private String reactivePoweR;
    @JsonProperty("apparentPower")
    private String apparentPower;
    @JsonProperty("activeTotalIE")
    private String activeTotalIE;
    @JsonProperty("cumulativeMD")
    private String cumulativeMD;
    @JsonProperty("thd_rPower")
    private String thd_rPower;
    @JsonProperty("thd_yPower")
    private String thd_yPower;
    @JsonProperty("thd_bPower")
    private String thd_bPower;
    @JsonProperty("temperature")
    private String temperature;
}
