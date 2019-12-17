package com.astute.iot.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.astute.iot.model.SMSConfig;
import com.astute.iot.repository.SMSRepository;

@Service
public class EmailService {
	
	@Autowired
	private JavaMailSender javaMailSender;
	
	@Autowired
	SMSRepository smsRepository;
	
	private SMSConfig config;
	
	void sendEmailOFF(String ssDeviceID, Integer vcbSerialNo ) {
		config = smsRepository.findById(1).get();
        SimpleMailMessage msg = new SimpleMailMessage();
        String mails[] = config.getEmail().trim().split(",");
        msg.setTo(mails);
        msg.setSubject(" Urgent Feeder Status Changed");
        msg.setText("CBISM ALERT At 33/11KV S/s Substation_" + ssDeviceID + ", Feeder_" + vcbSerialNo + 
        ", breaker status changed from ON to OFF, " + "at " + LocalDateTime.now());

        javaMailSender.send(msg);

    }
	

	void sendEmailON(String ssDeviceID, Integer vcbSerialNo ) {
		config = smsRepository.findById(1).get();
        SimpleMailMessage msg = new SimpleMailMessage();
        String mails[] = config.getEmail().trim().split(",");
        msg.setTo(mails);
        msg.setSubject(" Urgent Feeder Status Changed");
        msg.setText("CBISM ALERT At 33/11KV S/s Substation_" + ssDeviceID + ", Feeder_" + vcbSerialNo + 
        ", breaker status changed from OFF to ON, " + "at " + LocalDateTime.now());

        javaMailSender.send(msg);

    }
	
	

}
