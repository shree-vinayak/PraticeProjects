package com.astute.iot.service;

import com.astute.iot.dto.DailyLogSheetReportDto;
import com.astute.iot.dto.DailyOutageDto;
import com.astute.report.model.DailyLogSheet;
import com.astute.report.model.DailyOutage;
import com.astute.report.model.FeederReliability;
import com.itextpdf.text.pdf.PdfDocument;
import org.apache.poi.ss.usermodel.Workbook;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public interface ReportService {
    public DailyLogSheet getDailyLogSheet(String ssDeviceId, LocalDate date);

    public FeederReliability getFeederReliability(String ssDeviceId, LocalDate date);

    public List<DailyOutageDto> getDailyOutage(String ssDeviceId, LocalDate date);

    public Workbook exportDailyLogSheetAndFeederReliabilityExcel(DailyLogSheetReportDto dailyLogSheetReportDto);

    public Workbook exportDailyOutageExcel();

    public byte[] exportDailyLogSheetAndFeederReliabilityPdf(DailyLogSheetReportDto dailyLogSheetReportDto) throws Exception;
}
