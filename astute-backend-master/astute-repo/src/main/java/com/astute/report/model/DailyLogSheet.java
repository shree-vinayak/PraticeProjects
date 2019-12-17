package com.astute.report.model;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;

@Getter
@Setter
public class DailyLogSheet extends Report {

    private String devID0;

    private HashMap<String, String[]> currentAverages;

    private String[] dcVoltageAverages;

    private LocalDate date;

    @Override
    public String toString() {
        return "DailyLogSheet{" +
                "devID0='" + devID0 + '\'' +
                ", currentAverages=" + currentAverages +
                ", dcVoltageAverages=" + Arrays.toString(dcVoltageAverages) +
                ", date=" + date +
                '}';
    }
}
