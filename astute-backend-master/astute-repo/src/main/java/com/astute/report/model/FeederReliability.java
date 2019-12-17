package com.astute.report.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashMap;

@Getter
@Setter
public class FeederReliability {

    private HashMap<String, String[]> feederReliability;

    private String ssDeviceId;

    private LocalDate date;

    @Override
    public String toString() {
        return "FeederReliability{" +
                "feederReliability=" + feederReliability +
                ", ssDeviceId='" + ssDeviceId + '\'' +
                ", date=" + date +
                '}';
    }
}
