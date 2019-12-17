package com.astute.iot.service;

import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.astute.iot.dto.DailyLogSheetReportDto;
import com.astute.iot.dto.DailyOutageDto;
import com.astute.iot.model.CbismSubstationLog;
import com.astute.iot.model.DtaMFM;
import com.astute.iot.repository.CbismSubstationLogRepository;
import com.astute.iot.repository.DailyOutageRepository;
import com.astute.iot.util.Util;
import com.astute.report.model.DailyLogSheet;
import com.astute.report.model.DailyOutage;
import com.astute.report.model.FeederReliability;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

@Service
public class ReportServiceImpl implements ReportService {

	@Autowired
	private CbismSubstationLogRepository cbismSubstationLogRepository;

	@Autowired
	private Util util;

	@Autowired
	private DailyOutageRepository dailyOutageRepository;

	@Override
	public DailyLogSheet getDailyLogSheet(String ssDeviceId, LocalDate date) {
		final DailyLogSheet dailyLogSheet = new DailyLogSheet();

		final ArrayList<CbismSubstationLog> cbismSubstationLogs = cbismSubstationLogRepository
				.findByDevID0AndTimestampBetween(ssDeviceId, date.atStartOfDay(), date.atTime(LocalTime.MAX));
		// HashMap which maps the name of VCB to it's log sheet
		HashMap<String, String[]> currentAveragesMap = new HashMap<>();

		// Store the average currents
			String[][] currentAverages = new String[cbismSubstationLogs.get(0).getDtaMFM().size()][26];
		for (String[] arr : currentAverages)
			Arrays.fill(arr, "0");

		// Store the averages of DC voltage
		String dcAverages[] = new String[26];
		Arrays.fill(dcAverages, "0");

		// Keep the track of max average current for each meter
		HashMap<Integer, Integer> maxAverage = new HashMap<>();
		HashMap<Integer, LocalTime> maxAverageTimestamp = new HashMap<>();

		// Keep track of max DC voltage and the time
		Float maxDcVoltage = null;
		LocalTime maxDcVoltageTime = null;

		// Break the retrieved data into slabs of 1 hour
		for (int i = 0; i < 24; i++) {
			final int cur = i;

			// Retrieve all the logs where rtTime is between <i> and <i+1> hours
			final ArrayList<CbismSubstationLog> cbismSubstationLogsHour = cbismSubstationLogs.stream()
					.filter(cbismSubstationLog -> cbismSubstationLog.getRtTime().getHour() >= cur
							&& cbismSubstationLog.getRtTime().getHour() < (cur + 1))
					.collect(Collectors.toCollection(ArrayList::new));

			if (cbismSubstationLogsHour.size() == 0)
				continue;

			// Keep the running sum of current for each meter
			HashMap<Integer, Integer> currentHourSum = new HashMap<>();

			// Keep the running sum of DC voltage
			Float dcVoltageSum = 0.0f;

			// Iterate through all the logs of that hour
			for (CbismSubstationLog cbismSubstationLog : cbismSubstationLogsHour) {

				List<DtaMFM> dtaMFMS = cbismSubstationLog.getDtaMFM();
				for (DtaMFM dtaMFM : dtaMFMS) {
					// Calculate the average current value for each dtaMFM record and store it in a
					// hash map
					Integer rPhaseCurrent = dtaMFM.getCurPhR().intValue();
					Integer yPhaseCurrent = dtaMFM.getCurPhY().intValue();
					Integer bPhaseCurrent = dtaMFM.getCurPhB().intValue();
					rPhaseCurrent = (rPhaseCurrent >= 0) ? rPhaseCurrent : 0;
					yPhaseCurrent = (yPhaseCurrent >= 0) ? yPhaseCurrent : 0;
					bPhaseCurrent = (bPhaseCurrent >= 0) ? bPhaseCurrent : 0;
					Integer averageCurrent = (rPhaseCurrent + yPhaseCurrent + bPhaseCurrent) / 3;
					if (currentHourSum.containsKey(dtaMFM.getSn())) {
						// Add the average to the running sum in the map
						currentHourSum.put(dtaMFM.getSn(), averageCurrent + currentHourSum.get(dtaMFM.getSn()));
					} else {
						currentHourSum.put(dtaMFM.getSn(), averageCurrent);
					}
					if (maxAverage.containsKey(dtaMFM.getSn())) {
						// Check if the average current is greater than the max. average current stored
						// in hash map
						if (averageCurrent > maxAverage.get(dtaMFM.getSn())) {
							// Update the map
							maxAverage.put(dtaMFM.getSn(), averageCurrent);
							maxAverageTimestamp.put(dtaMFM.getSn(), cbismSubstationLog.getRtTime());
						}
					} else {
						maxAverage.put(dtaMFM.getSn(), averageCurrent);
						maxAverageTimestamp.put(dtaMFM.getSn(), cbismSubstationLog.getRtTime());
					}
				}
				Float dcVoltage = Float.parseFloat(cbismSubstationLog.getVolDC1());
				dcVoltageSum += dcVoltage;
				if (maxDcVoltage == null || (dcVoltage > maxDcVoltage)) {
					maxDcVoltage = dcVoltage;
					maxDcVoltageTime = cbismSubstationLog.getRtTime();
				}
			}

			// Now calculate the averages of all the average current for that hour
			for (Integer key : currentHourSum.keySet()) {
				currentAverages[key - 1][i] = String.valueOf(currentHourSum.get(key) / cbismSubstationLogsHour.size());
			}

			// Calculate the average of DC voltage
			dcAverages[i] = String.valueOf(dcVoltageSum / cbismSubstationLogsHour.size());
		}

		// Now put the max average and time values in the map
		for (Integer key : maxAverage.keySet()) {
			currentAverages[key - 1][24] = maxAverage.get(key).toString();
			currentAverages[key - 1][25] = maxAverageTimestamp.get(key).toString();
		}

		// Set the max DC voltage and time
		dcAverages[24] = maxDcVoltage.toString();
		dcAverages[25] = maxDcVoltageTime.toString();

		// Put the current averages into the map
		for (int i = 0; i < currentAverages.length; i++) {
			currentAveragesMap.put(String.valueOf(i + 1), currentAverages[i]);
		}

		dailyLogSheet.setCurrentAverages(currentAveragesMap);
		dailyLogSheet.setDcVoltageAverages(dcAverages);
		dailyLogSheet.setDevID0(ssDeviceId);
		dailyLogSheet.setDate(date);

		return dailyLogSheet;
	}

	@Override
	public FeederReliability getFeederReliability(String ssDeviceId, LocalDate date) {
		FeederReliability outputFeederReliability = new FeederReliability();

		// Retrieve all the logs for that particular day and order them by rtTime(ASC)
		ArrayList<CbismSubstationLog> cbismSubstationLogs = cbismSubstationLogRepository
				.findByDevID0AndTimestampBetweenOrderByRtTimeAsc(ssDeviceId, date.atStartOfDay(),
						date.atTime(LocalTime.MAX));

		// Hashmap which maps the VCB number to it's latest state
		HashMap<Integer, String> latestVcbStatus = new HashMap<>();

		// Hashmap which maps the VCB number to it's total outage time
		HashMap<Integer, Long> totalVcbOutageTime = new HashMap<>();

		// Hashmap which maps the VCB number to it's last 'OFF' timestamp
		HashMap<Integer, LocalTime> prevVcbTimestamp = new HashMap<>();

		// Hashmap which maps the VCB number to it's total number of outages
		HashMap<Integer, Integer> totalVcbOutages = new HashMap<>();

		// Hashmap which maps the VCB number to it's total supply
		HashMap<Integer, Long> totalSupply = new HashMap<>();

		// Hashmap which maps the VCB number to it's reliability
		HashMap<Integer, String> vcbReliability = new HashMap<>();

		for (CbismSubstationLog cbismSubstationLog : cbismSubstationLogs) {
			final String vcbStatus = cbismSubstationLog.getVcbStt();
			// First iteration
			if (latestVcbStatus.size() == 0) {
				for (int i = 0; i < vcbStatus.length(); i++) {
					// Get the equivalent binary notation of the hex digit
					final String vcbStatusBinary = util.convertHexaToBinary(String.valueOf(vcbStatus.charAt(i)));
					// Check for the last two digits
					if (vcbStatusBinary.charAt(2) == '0' && vcbStatusBinary.charAt(3) == '1') {
						latestVcbStatus.put(i + 1, "ON");
						totalVcbOutageTime.put(i + 1, 0L);
						prevVcbTimestamp.put(i + 1, null);
						totalVcbOutages.put(i + 1, 0);
					} else if (vcbStatusBinary.charAt(2) == '1' && vcbStatusBinary.charAt(3) == '0') {
						latestVcbStatus.put(i + 1, "OFF");
						totalVcbOutageTime.put(i + 1, 0L);
						prevVcbTimestamp.put(i + 1, cbismSubstationLog.getRtTime());
						totalVcbOutages.put(i + 1, 0);
					} else {
						latestVcbStatus.put(i + 1, "INVALID");
						totalVcbOutageTime.put(i + 1, 0L);
						prevVcbTimestamp.put(i + 1, null);
						totalVcbOutages.put(i + 1, 0);
					}
				}
			} else {
				// Check for the change of state for each VCB
				for (int i = 0; i < vcbStatus.length(); i++) {
					// Get the binary equivalent of the hexadecimal digit
					final String vcbStatusBinary = util.convertHexaToBinary(String.valueOf(vcbStatus.charAt(i)));

					// If a VCB status changes from OFF to ON, there's an outage!!
					if (latestVcbStatus.get(i + 1).equals("OFF")
							&& (vcbStatusBinary.charAt(2) == '0' && vcbStatusBinary.charAt(3) == '1')) {

						// Update the latestVCBStatus
						latestVcbStatus.put(i + 1, "ON");

						// Increment the outage count for that VCB
						totalVcbOutages.put(i + 1, totalVcbOutages.get(i + 1) + 1);

						// calculate the outage time
						Long outageTimeMinutes = Duration
								.between(prevVcbTimestamp.get(i + 1), cbismSubstationLog.getRtTime()).toMinutes();

						// Update the total outage time in the map
						totalVcbOutageTime.put(i + 1, totalVcbOutageTime.get(i + 1) + outageTimeMinutes);
					} else if (latestVcbStatus.get(i + 1).equals("ON")
							&& (vcbStatusBinary.charAt(2) == '1' && vcbStatusBinary.charAt(3) == '0')) {

						// Update the latestVCBStatus
						latestVcbStatus.put(i + 1, "OFF");

						// If the status changes from ON to OFF, it means the outage has begun
						// So, update the value of last 'OFF' timestamp to the current rtTime
						prevVcbTimestamp.put(i + 1, cbismSubstationLog.getRtTime());
					} else if (latestVcbStatus.get(i + 1).equals("INVALID")) {
						if (vcbStatusBinary.charAt(2) == '1' && vcbStatusBinary.charAt(3) == '0') {
							latestVcbStatus.put(i + 1, "OFF");
							if (prevVcbTimestamp.get(i + 1) == null)
								prevVcbTimestamp.put(i + 1, cbismSubstationLog.getRtTime());
						} else if (vcbStatusBinary.charAt(2) == '0' && vcbStatusBinary.charAt(3) == '1')
							latestVcbStatus.put(i + 1, "ON");
					}
				}
			}
		}

		// Calculate the total supply for each VCB
		for (Integer key : totalVcbOutageTime.keySet()) {
			totalSupply.put(key, 1440 - totalVcbOutageTime.get(key));
		}

		// Calculat the reliability for each VCB
		for (Integer key : totalSupply.keySet()) {
			String reliability = new DecimalFormat("#.##").format((totalSupply.get(key) / 1440.0) * 100);
			vcbReliability.put(key, reliability);
		}

		// Form the final HashMap which contains all the required parameters
		HashMap<String, String[]> feederReliability = new HashMap<>();
		for (Integer key : latestVcbStatus.keySet()) {
			String[] parameters = new String[4];
			parameters[0] = totalVcbOutages.get(key).toString();
			parameters[1] = totalVcbOutageTime.get(key).toString();
			parameters[2] = totalSupply.get(key).toString();
			parameters[3] = vcbReliability.get(key);

			feederReliability.put(key.toString(), parameters);
		}

		outputFeederReliability.setFeederReliability(feederReliability);
		outputFeederReliability.setSsDeviceId(ssDeviceId);
		outputFeederReliability.setDate(date);

		return outputFeederReliability;
	}

	@Override
	public List<DailyOutageDto> getDailyOutage(String ssDeviceId, LocalDate date) {
		List<DailyOutage> dailyOutages = null;
		List<DailyOutageDto> dailyOutageDtos = new ArrayList<>();
		// Retrieve the outages
		dailyOutages = dailyOutageRepository.findBySsDeviceIdAndOutageStartTimeBetween(ssDeviceId, date.atStartOfDay(),
				date.atTime(LocalTime.MAX));

		for (DailyOutage dailyOutage : dailyOutages) {
			DailyOutageDto dailyOutageDto = new DailyOutageDto();
			dailyOutageDto.setVcbSerialNo(dailyOutage.getVcbSerialNumber());
			dailyOutageDto.setOutageStartTime(dailyOutage.getOutageStartTime());
			dailyOutageDto.setOutageEndTime(dailyOutage.getOutageEndTime());
			LocalDateTime outageStartTime = dailyOutageDto.getOutageStartTime();
			if(dailyOutageDto.getOutageEndTime()!=null){
				LocalDateTime outageEndTime = dailyOutageDto.getOutageEndTime();
				dailyOutageDto.setOutageDuration(Duration.between(outageStartTime, outageEndTime).toMinutes());

				dailyOutageDtos.add(dailyOutageDto);
			}
		}

		return dailyOutageDtos;
	}

	private Workbook createDailyLogSheetAndFeederReliabilityWorkbook() {
		Workbook workbook = new XSSFWorkbook();
		CreationHelper creationHelper = workbook.getCreationHelper();
		return workbook;
	}

	// Creates daily log sheet with headers
	private void createDailyLogSheet(Workbook workbook, DailyLogSheet dailyLogSheet) {
		final String[] columns = { "Feeder name", "Unit", "1 hr", "2 hr", "3 hr", "4 hr", "5 hr", "6 hr", "7 hr",
				"8 hr", "9 hr", "10 hr", "11 hr", "12 hr", "13 hr", "14 hr", "15 hr", "16 hr", "17 hr", "18 hr",
				"19 hr", "20 hr", "21 hr", "22 hr", "23 hr", "24 hr", "MAX", "MAX TIME" };

		// Create new sheet for daily log sheet
		Sheet sheet = workbook.createSheet("daily_log_sheet");

		// Create a basic template for the file

		CellRangeAddress rangeAddress1 = new CellRangeAddress(0, 0, 0, 27);
		sheet.addMergedRegion(rangeAddress1);

		CellRangeAddress rangeAddress2 = new CellRangeAddress(1, 1, 0, 27);
		sheet.addMergedRegion(rangeAddress2);

		CellRangeAddress rangeAddress3 = new CellRangeAddress(2, 3, 0, 13);
		sheet.addMergedRegion(rangeAddress3);

		CellRangeAddress rangeAddress4 = new CellRangeAddress(2, 3, 14, 27);
		sheet.addMergedRegion(rangeAddress4);

		// Main heading
		Font mainHeaderFont = workbook.createFont();
		mainHeaderFont.setBold(true);
		mainHeaderFont.setFontHeightInPoints((short) 18);

		CellStyle mainHeadingStyle = workbook.createCellStyle();
		mainHeadingStyle.setFont(mainHeaderFont);
		mainHeadingStyle.setAlignment(HorizontalAlignment.CENTER);
		mainHeadingStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		Row mainHeadingRow = sheet.createRow(0);
		Cell mainHeadingCell = mainHeadingRow.createCell(0);
		mainHeadingCell.setCellValue("MADHYA PRADESH MADHYA KSHETRA VIDYUT VITRAN CO. LTD.");
		mainHeadingCell.setCellStyle(mainHeadingStyle);

		// Sub-heading
		Font subHeadingFont = workbook.createFont();
		subHeadingFont.setBold(true);
		subHeadingFont.setFontHeightInPoints((short) 14);

		CellStyle subHeadingStyle = workbook.createCellStyle();
		subHeadingStyle.setFont(subHeadingFont);
		subHeadingStyle.setAlignment(HorizontalAlignment.CENTER);
		subHeadingStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		Row subHeadingRow = sheet.createRow(1);
		Cell subHeadingCell = subHeadingRow.createCell(0);
		subHeadingCell.setCellValue("DAILY LOG SHEET");
		subHeadingCell.setCellStyle(subHeadingStyle);

		// Date and substation
		Row dateAndSubstationRow = sheet.createRow(2);
		Cell substationCell = dateAndSubstationRow.createCell(0);
		substationCell.setCellValue("Substation Device: " + dailyLogSheet.getDevID0());
		substationCell.setCellStyle(subHeadingStyle);

		Cell dateCell = dateAndSubstationRow.createCell(14);
		dateCell.setCellValue("Date: " + dailyLogSheet.getDate());
		dateCell.setCellStyle(subHeadingStyle);

		// Create table header font
		Font headerFont = workbook.createFont();
		headerFont.setBold(true);
		headerFont.setFontHeightInPoints((short) 14);
		headerFont.setColor(IndexedColors.GREEN.getIndex());
		// headerFont.setColor(IndexedColors.GREEN.getIndex());

		// Create feeder name cell font and style
		Font feederNameFont = workbook.createFont();
		feederNameFont.setBold(true);
		feederNameFont.setFontHeightInPoints((short) 10);
		CellStyle feederNameStyle = workbook.createCellStyle();
		feederNameStyle.setFont(feederNameFont);
		feederNameStyle.setBorderBottom(BorderStyle.MEDIUM);
		feederNameStyle.setBorderLeft(BorderStyle.MEDIUM);
		feederNameStyle.setBorderRight(BorderStyle.MEDIUM);
		feederNameStyle.setBorderTop(BorderStyle.MEDIUM);
		feederNameStyle.setAlignment(HorizontalAlignment.CENTER);
		feederNameStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		// Create normal cell font and style
		Font normalFont = workbook.createFont();
		normalFont.setFontHeightInPoints((short) 10);
		CellStyle normalStyle = workbook.createCellStyle();
		normalStyle.setFont(normalFont);
		normalStyle.setBorderBottom(BorderStyle.MEDIUM);
		normalStyle.setBorderLeft(BorderStyle.MEDIUM);
		normalStyle.setBorderRight(BorderStyle.MEDIUM);
		normalStyle.setBorderTop(BorderStyle.MEDIUM);
		normalStyle.setAlignment(HorizontalAlignment.CENTER);
		normalStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		// Set header style
		CellStyle headerCellStyle = workbook.createCellStyle();
		headerCellStyle.setFont(headerFont);
		headerCellStyle.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
		headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerCellStyle.setBorderBottom(BorderStyle.MEDIUM);
		headerCellStyle.setBorderLeft(BorderStyle.MEDIUM);
		headerCellStyle.setBorderRight(BorderStyle.MEDIUM);
		headerCellStyle.setBorderTop(BorderStyle.MEDIUM);
		headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
		headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		// Create header row
		Row headerRow = sheet.createRow(4);
		// Create header cells
		for (int i = 0; i < columns.length; i++) {
			Cell cell = headerRow.createCell(i);
			cell.setCellValue(columns[i]);
			cell.setCellStyle(headerCellStyle);
		}

		int rowNum = 5;

		// Now fill current averages for all feeders
		for (String feeder : dailyLogSheet.getCurrentAverages().keySet()) {
			// Create a row for each feeder
			Row feederRow = sheet.createRow(rowNum++);

			// Create a cell having feeder name
			Cell feederNameCell = feederRow.createCell(0);
			feederNameCell.setCellStyle(feederNameStyle);
			feederNameCell.setCellValue(feeder);

			// Create a cell having unit
			Cell unitCell = feederRow.createCell(1);
			unitCell.setCellStyle(feederNameStyle);
			unitCell.setCellValue("AMP");

			// Fill the values corresponding to that feeder
			int cellIndex = 2;
			for (String val : dailyLogSheet.getCurrentAverages().get(feeder)) {
				Cell valueCell = feederRow.createCell(cellIndex++);
				valueCell.setCellValue(val);
				valueCell.setCellStyle(normalStyle);
			}
		}

		// Now fill dc voltage averages

		Row dcVoltageRow = sheet.createRow(rowNum++);
		Cell dcVoltageName = dcVoltageRow.createCell(0);
		dcVoltageName.setCellStyle(feederNameStyle);
		dcVoltageName.setCellValue("DC VOLTAGE");

		// Create a cell having unit
		Cell unitCell = dcVoltageRow.createCell(1);
		unitCell.setCellStyle(feederNameStyle);
		unitCell.setCellValue("VOLT");

		int cellIndex = 2;
		for (String val : dailyLogSheet.getDcVoltageAverages()) {
			Cell valueCell = dcVoltageRow.createCell(cellIndex++);
			valueCell.setCellStyle(normalStyle);
			valueCell.setCellValue(val);
		}

		// Autosize all the columns
		for (int i = 0; i < columns.length; i++) {
			sheet.autoSizeColumn(i);
		}
	}

	private void createFeederReliability(Workbook workbook, FeederReliability feederReliability) {
		// Create new sheet for feeder reliability
		Sheet sheet = workbook.createSheet("feeder_reliability");

		// Create a basic template for the file
		CellRangeAddress rangeAddress1 = new CellRangeAddress(0, 1, 0, 18);
		sheet.addMergedRegion(rangeAddress1);

		// Main heading
		Font mainHeaderFont = workbook.createFont();
		mainHeaderFont.setBold(true);
		mainHeaderFont.setFontHeightInPoints((short) 18);

		CellStyle mainHeadingStyle = workbook.createCellStyle();
		mainHeadingStyle.setFont(mainHeaderFont);
		mainHeadingStyle.setAlignment(HorizontalAlignment.CENTER);
		mainHeadingStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		mainHeadingStyle.setBorderBottom(BorderStyle.MEDIUM);
		mainHeadingStyle.setBorderLeft(BorderStyle.MEDIUM);
		mainHeadingStyle.setBorderRight(BorderStyle.MEDIUM);
		mainHeadingStyle.setBorderTop(BorderStyle.MEDIUM);

		Row mainHeadingRow = sheet.createRow(0);
		Cell mainHeadingCell = mainHeadingRow.createCell(0);
		mainHeadingCell.setCellValue("FEEDER RELIABILITY");
		mainHeadingCell.setCellStyle(mainHeadingStyle);

		// Create table header font
		Font headerFont = workbook.createFont();
		headerFont.setBold(true);
		headerFont.setFontHeightInPoints((short) 14);
		headerFont.setColor(IndexedColors.GREEN.getIndex());

		CellStyle headerCellStyle = workbook.createCellStyle();
		headerCellStyle.setFont(headerFont);
		headerCellStyle.setAlignment(HorizontalAlignment.CENTER);
		headerCellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		headerCellStyle.setBorderBottom(BorderStyle.MEDIUM);
		headerCellStyle.setBorderLeft(BorderStyle.MEDIUM);
		headerCellStyle.setBorderRight(BorderStyle.MEDIUM);
		headerCellStyle.setBorderTop(BorderStyle.MEDIUM);
		headerCellStyle.setFillForegroundColor(IndexedColors.YELLOW.getIndex());
		headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

		// Sub-heading
		Font subHeadingFont = workbook.createFont();
		subHeadingFont.setBold(true);
		subHeadingFont.setFontHeightInPoints((short) 14);

		CellStyle subHeadingStyle = workbook.createCellStyle();
		subHeadingStyle.setFont(subHeadingFont);
		subHeadingStyle.setAlignment(HorizontalAlignment.CENTER);
		subHeadingStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		subHeadingStyle.setBorderBottom(BorderStyle.MEDIUM);
		subHeadingStyle.setBorderLeft(BorderStyle.MEDIUM);
		subHeadingStyle.setBorderRight(BorderStyle.MEDIUM);
		subHeadingStyle.setBorderTop(BorderStyle.MEDIUM);

		// Create normal cell font and style
		Font normalFont = workbook.createFont();
		normalFont.setFontHeightInPoints((short) 10);
		CellStyle normalStyle = workbook.createCellStyle();
		normalStyle.setFont(normalFont);
		normalStyle.setBorderBottom(BorderStyle.MEDIUM);
		normalStyle.setBorderLeft(BorderStyle.MEDIUM);
		normalStyle.setBorderRight(BorderStyle.MEDIUM);
		normalStyle.setBorderTop(BorderStyle.MEDIUM);
		normalStyle.setAlignment(HorizontalAlignment.CENTER);
		normalStyle.setVerticalAlignment(VerticalAlignment.CENTER);

		int colIndex;

		// Create the header row
		Row headerRow = sheet.createRow(2);
		Cell headerCell = headerRow.createCell(0);
		headerCell.setCellValue("11KV FEEDER");
		headerCell.setCellStyle(subHeadingStyle);

		// List which contains the order of retrieval from the map
		ArrayList<String> feederNames = new ArrayList<>();

		colIndex = 1;
		for (String feeder : feederReliability.getFeederReliability().keySet()) {
			feederNames.add(feeder);
			Cell feederCell = headerRow.createCell(colIndex++);
			feederCell.setCellValue(feeder);
			feederCell.setCellStyle(headerCellStyle);
		}

		// Create outage row
		Row outageNoRow = sheet.createRow(3);
		Cell outageNoCell = outageNoRow.createCell(0);
		outageNoCell.setCellValue("NO. OF OUTAGES");
		outageNoCell.setCellStyle(subHeadingStyle);

		colIndex = 1;
		for (String feeder : feederNames) {
			Cell valueCell = outageNoRow.createCell(colIndex++);
			valueCell.setCellValue(feederReliability.getFeederReliability().get(feeder)[0]);
			valueCell.setCellStyle(normalStyle);
		}

		// Create outage min row
		Row outageMinRow = sheet.createRow(4);
		Cell outageMinCell = outageMinRow.createCell(0);
		outageMinCell.setCellValue("OUTAGE DURATION (MINUTES)");
		outageMinCell.setCellStyle(subHeadingStyle);

		colIndex = 1;
		for (String feeder : feederNames) {
			Cell valueCell = outageMinRow.createCell(colIndex++);
			valueCell.setCellValue(feederReliability.getFeederReliability().get(feeder)[1]);
			valueCell.setCellStyle(normalStyle);
		}

		// Create supply min row
		Row supplyMinRow = sheet.createRow(5);
		Cell supplyMinCell = supplyMinRow.createCell(0);
		supplyMinCell.setCellValue("SUPPLY DURATION (MINUTES)");
		supplyMinCell.setCellStyle(subHeadingStyle);

		colIndex = 1;
		for (String feeder : feederNames) {
			Cell valueCell = supplyMinRow.createCell(colIndex++);
			valueCell.setCellValue(feederReliability.getFeederReliability().get(feeder)[2]);
			valueCell.setCellStyle(normalStyle);
		}

		// Create reliability row
		Row reliabilityRow = sheet.createRow(6);
		Cell reliabilityCell = reliabilityRow.createCell(0);
		reliabilityCell.setCellValue("RELIABILITY (%)");
		reliabilityCell.setCellStyle(subHeadingStyle);

		colIndex = 1;
		for (String feeder : feederNames) {
			Cell valueCell = reliabilityRow.createCell(colIndex++);
			valueCell.setCellValue(feederReliability.getFeederReliability().get(feeder)[3]);
			valueCell.setCellStyle(normalStyle);
		}

		// Autosize all the columns
		for (int i = 0; i < feederReliability.getFeederReliability().size() + 1; i++) {
			sheet.autoSizeColumn(i);
		}
	}

	@Override
	public Workbook exportDailyLogSheetAndFeederReliabilityExcel(DailyLogSheetReportDto dailyLogSheetReportDto) {
		if (dailyLogSheetReportDto.getDailyLogSheetReport() == null
				|| dailyLogSheetReportDto.getFeederReliabilityReport() == null)
			return null;

		// Create an empty workbook
		Workbook workbook = createDailyLogSheetAndFeederReliabilityWorkbook();

		// export the daily log sheet report
		createDailyLogSheet(workbook, dailyLogSheetReportDto.getDailyLogSheetReport());

		// export the feeder reliability report
		createFeederReliability(workbook, dailyLogSheetReportDto.getFeederReliabilityReport());

		return workbook;
	}

	@Override
	public Workbook exportDailyOutageExcel() {
		Workbook workbook = new XSSFWorkbook();

		return workbook;
	}

	private void exportDailyLogSheetPdf(Document document, DailyLogSheet dailyLogSheet) throws Exception {
		PdfPTable dailyLogSheetTable = new PdfPTable(280);
		dailyLogSheetTable.setWidthPercentage(100);
		final String[] columns = { "Feeder name", "Unit", "1 hr", "2 hr", "3 hr", "4 hr", "5 hr", "6 hr", "7 hr",
				"8 hr", "9 hr", "10 hr", "11 hr", "12 hr", "13 hr", "14 hr", "15 hr", "16 hr", "17 hr", "18 hr",
				"19 hr", "20 hr", "21 hr", "22 hr", "23 hr", "24 hr", "MAX", "MAX TIME" };

		com.itextpdf.text.Font headingFont = new com.itextpdf.text.Font();
		headingFont.setStyle(com.itextpdf.text.Font.BOLD);
		headingFont.setSize(24);
		Paragraph headingParagraph = new Paragraph("MADHYA PRADESH MADHYA KSHETRA VIDYUT VITRAN CO. LTD.");
		headingParagraph.setFont(headingFont);
		PdfPCell heading = new PdfPCell(headingParagraph);
		heading.setColspan(280);
		heading.setRowspan(3);
		heading.setHorizontalAlignment(Element.ALIGN_CENTER);
		heading.setVerticalAlignment(Element.ALIGN_MIDDLE);

		com.itextpdf.text.Font subHeadingFont = new com.itextpdf.text.Font();
		subHeadingFont.setStyle(com.itextpdf.text.Font.BOLD);
		subHeadingFont.setSize(22);
		Paragraph subHeadingParagraph = new Paragraph("DAILY LOG SHEET");
		subHeadingParagraph.setFont(subHeadingFont);
		PdfPCell subHeading = new PdfPCell(subHeadingParagraph);
		subHeading.setColspan(280);
		subHeading.setRowspan(2);
		subHeading.setHorizontalAlignment(Element.ALIGN_CENTER);
		subHeading.setVerticalAlignment(Element.ALIGN_MIDDLE);

		com.itextpdf.text.Font deviceAndDateFont = new com.itextpdf.text.Font();
		deviceAndDateFont.setStyle(com.itextpdf.text.Font.BOLD);
		deviceAndDateFont.setSize(20);

		Paragraph ssDeviceParagraph = new Paragraph(dailyLogSheet.getDevID0());
		ssDeviceParagraph.setFont(deviceAndDateFont);
		PdfPCell ssDevice = new PdfPCell(ssDeviceParagraph);
		ssDevice.setColspan(140);
		ssDevice.setHorizontalAlignment(Element.ALIGN_CENTER);
		ssDevice.setVerticalAlignment(Element.ALIGN_MIDDLE);

		Paragraph dateParagraph = new Paragraph(dailyLogSheet.getDate().toString());
		dateParagraph.setFont(deviceAndDateFont);
		PdfPCell date = new PdfPCell(dateParagraph);
		date.setColspan(140);
		date.setHorizontalAlignment(Element.ALIGN_CENTER);
		date.setVerticalAlignment(Element.ALIGN_MIDDLE);

		dailyLogSheetTable.addCell(heading);
		dailyLogSheetTable.addCell(subHeading);
		dailyLogSheetTable.addCell(ssDevice);
		dailyLogSheetTable.addCell(date);

		com.itextpdf.text.Font columnFont = new com.itextpdf.text.Font();
		columnFont.setStyle(com.itextpdf.text.Font.BOLD);
		columnFont.setSize(14);
		// Add columns
		for (String col : columns) {
			Paragraph colHParagraph = new Paragraph(col);
			colHParagraph.setFont(columnFont);
			PdfPCell colH = new PdfPCell(colHParagraph);
			colH.setColspan(10);
			dailyLogSheetTable.addCell(colH);
		}

		document.add(dailyLogSheetTable);
	}

	@Override
	public byte[] exportDailyLogSheetAndFeederReliabilityPdf(DailyLogSheetReportDto dailyLogSheetReportDto)
			throws Exception {
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

		Document document = new Document();
		PdfWriter.getInstance(document, byteArrayOutputStream);
		document.open();

		// First export daily log sheet
		exportDailyLogSheetPdf(document, dailyLogSheetReportDto.getDailyLogSheetReport());

		// Now export feeder reliability
		document.close();

		return byteArrayOutputStream.toByteArray();
	}
}
