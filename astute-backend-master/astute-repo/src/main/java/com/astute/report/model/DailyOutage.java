package com.astute.report.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.HashMap;

@Entity
@Getter
@Setter
public class DailyOutage extends Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ssDeviceId;

    private Integer vcbSerialNumber;

    private LocalDateTime outageStartTime;

    private LocalDateTime outageEndTime;
    
    private Boolean sms_flag_on;
    
    private Boolean sms_flag_off;
    
    private Boolean email_flag_off;
    
    private Boolean email_flag_on;
}
