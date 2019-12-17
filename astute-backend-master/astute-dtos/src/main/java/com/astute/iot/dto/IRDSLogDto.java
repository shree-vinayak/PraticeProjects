package com.astute.iot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IRDSLogDto {
    @JsonProperty("deviceNumber")
    private String deviceNumber;
    @JsonProperty("password")
    private String password;
    @JsonProperty("requestType")
    private String requestType;
    @JsonProperty("LineVoltageR")
    private String LineVoltageR;
    @JsonProperty("LineVoltageY")
    private String LineVoltageY;
    @JsonProperty("LineVoltageB")
    private String LineVoltageB;
    @JsonProperty("terminalCode")
    private String terminalCode;
    @JsonProperty("relayStatus")
    private String relayStatus;
    @JsonProperty("LineCurrent")
    private String LineCurrent;
    @JsonProperty("ActivePower")
    private String ActivePower;
    @JsonProperty("ReactiPower")
    private String ReactiPower;
    @JsonProperty("Pf")
    private String Pf;
    @JsonProperty("KWh_PhaseWise")
    private String KWh_PhaseWise;
    @JsonProperty("KWh")
    private String KWh;
    @JsonProperty("KWhImp")
    private String KWhImp;
    @JsonProperty("KWhExp")
    private String KWhExp;
    @JsonProperty("KVAh")
    private String KVAh;
    @JsonProperty("KVAhImp")
    private String KVAhImp;
    @JsonProperty("KVAhExp")
    private String KVAhExp;
}
