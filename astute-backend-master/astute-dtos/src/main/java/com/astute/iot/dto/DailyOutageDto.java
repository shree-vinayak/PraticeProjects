package com.astute.iot.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DailyOutageDto {
    private Integer vcbSerialNo;

    private LocalDateTime outageStartTime;

    private LocalDateTime outageEndTime;

    private Long outageDuration;
}
