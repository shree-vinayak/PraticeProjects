package com.astute.iot.controller;
//Created by Aditya Tiwari on 06-06-2019

import com.astute.iot.dto.DailyLogSheetReportDto;
import com.astute.iot.dto.DailyOutageDto;
import com.astute.iot.service.ReportService;
import com.astute.report.model.DailyLogSheet;
import com.astute.report.model.DailyOutage;
import com.astute.report.model.FeederReliability;
import com.itextpdf.text.pdf.PdfDocument;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ReportController {
	// Date format -> dd-MM-yyyy

	@Autowired
	private ReportService reportService;

	@GetMapping(value = "/dailylogsheet", produces = "application/json")
	public ResponseEntity<DailyLogSheet> getDailyLogSheet(@RequestParam("devID0") String ssDeviceId,
			@RequestParam("date") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date) {
		final DailyLogSheet dailyLogSheet = reportService.getDailyLogSheet(ssDeviceId, date);
		return new ResponseEntity<DailyLogSheet>(dailyLogSheet, HttpStatus.OK);
	}

	@GetMapping(value = "/dailyfeederreliability", produces = "application/json")
	public ResponseEntity<FeederReliability> getDailyFeederReliability(@RequestParam("devID0") String ssDeviceId,
			@RequestParam("date") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date) {
		final FeederReliability feederReliability = reportService.getFeederReliability(ssDeviceId, date);
		return new ResponseEntity<FeederReliability>(feederReliability, HttpStatus.OK);
	}

	@GetMapping(value = "/dailyoutage", produces = "application/json")
	public ResponseEntity<List<DailyOutageDto>> getDailyOutage(@RequestParam("devID0") String ssDeviceId,
			@RequestParam("date") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate date) {
		final List<DailyOutageDto> dailyOutageDtos = reportService.getDailyOutage(ssDeviceId, date);
		return new ResponseEntity<List<DailyOutageDto>>(dailyOutageDtos, HttpStatus.OK);
	}

	@PostMapping(value = "/exportdailylogsheetexcel", consumes = "application/json")
	public ResponseEntity exportDailyLogSheetAndFeederReliabilityExcel(HttpServletResponse response,
			@RequestBody DailyLogSheetReportDto dailyLogSheetReportDto) {
		;
		Workbook exportedExcel = reportService.exportDailyLogSheetAndFeederReliabilityExcel(dailyLogSheetReportDto);
		ResponseEntity responseEntity = null;
		if (exportedExcel != null) {
			try {
				String fileName = "Daily_Log_Sheet_" + dailyLogSheetReportDto.getDailyLogSheetReport().getDevID0() + "_"
						+ LocalDate.now() + ".xlsx";
				response.setContentType("application/vnd.ms-excel");
				response.setHeader("Content-disposition", "attachment; filename=" + fileName);

				ServletOutputStream outputStream = response.getOutputStream();
				exportedExcel.write(outputStream);

				exportedExcel.close();
				outputStream.flush();
				response.flushBuffer();

			} catch (Exception e) {
				e.printStackTrace();
				responseEntity = new ResponseEntity("Error occurred while generating excel!",
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			responseEntity = new ResponseEntity("Please generate the report before exporting it to excel!",
					HttpStatus.BAD_REQUEST);
		}

		return responseEntity;
	}

	@PostMapping(value = "/exportdailylogsheetpdf", consumes = "application/json")
	public ResponseEntity exportDailyLogSheetAndFeederReliabilityPdf(HttpServletResponse response,
			@RequestBody DailyLogSheetReportDto dailyLogSheetReportDto) {
		ResponseEntity responseEntity = null;
		if (dailyLogSheetReportDto.getDailyLogSheetReport() != null
				&& dailyLogSheetReportDto.getFeederReliabilityReport() != null) {
			try {
				String fileName = "Daily_Log_Sheet_" + dailyLogSheetReportDto.getDailyLogSheetReport().getDevID0() + "_"
						+ LocalDate.now() + ".pdf";
				response.setContentType("application/pdf");
				response.setHeader("Content-disposition", "attachment; filename=" + fileName);

				byte[] documentBytes = reportService.exportDailyLogSheetAndFeederReliabilityPdf(dailyLogSheetReportDto);
				ServletOutputStream outputStream = response.getOutputStream();
				outputStream.write(documentBytes);

				outputStream.flush();
				response.flushBuffer();
			} catch (Exception e) {
				e.printStackTrace();
				responseEntity = new ResponseEntity("Error occurred while generating pdf!",
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			responseEntity = new ResponseEntity("Please generate the report before exporting it to pdf!",
					HttpStatus.BAD_REQUEST);
		}

		return responseEntity;
	}
}
