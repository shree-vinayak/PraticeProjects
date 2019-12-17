package com.astute.iot.dto;

import com.astute.report.model.DailyLogSheet;
import com.astute.report.model.FeederReliability;
import lombok.Data;

@Data
public class DailyLogSheetReportDto {
    private DailyLogSheet dailyLogSheetReport;

    private FeederReliability feederReliabilityReport;
}
