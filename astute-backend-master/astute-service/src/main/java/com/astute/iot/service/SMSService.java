package com.astute.iot.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.astute.iot.model.SMSConfig;
import com.astute.iot.repository.SMSRepository;

@Service
public class SMSService {
	private SMSConfig config;

	@Autowired
	Logger logger;

	@Autowired
	SMSRepository smsRepository;

	private void configure() {
		/*
		 * config.setAuthKey("95140AwZu8em2R562496c7".trim());
		 * config.setCountry("91".trim()); config.setRoute("4");
		 * config.setHost("http://control.msg91.com/api/sendhttp.php".trim());
		 * config.setSender("ASTUTE");
		 * config.setMobiles("7869655445,7879351505,9479803953,9691655566");
		 * smsRepository.save(this.config);
		 */
		config = smsRepository.findById(1).get();
	}

	public SMSService() {
	}

	public String sendSMS(String message) {
		if (this.config == null) {
			this.configure();
		}
		logger.info("Sending Message");
		Map<String, String> vars = new HashMap<>();
		vars.put("authkey", config.getAuthKey());
		vars.put("country", config.getCountry());
		vars.put("route", config.getRoute());
		vars.put("sender", config.getSender());
		vars.put("mobiles", config.getMobiles());
		vars.put("message", message);

		RestTemplate restTemplate = new RestTemplate();

		UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(config.getHost());
		for (Map.Entry<String, String> param : vars.entrySet()) {
			builder.queryParam(param.getKey(), param.getValue());
		}
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
		HttpEntity<String> entity = new HttpEntity<String>("parameters", headers);
		ResponseEntity<String> result = restTemplate.exchange(builder.buildAndExpand(vars).toUri(), HttpMethod.GET,
				entity, String.class);
		logger.info(result.getBody());
		logger.info("Message Sent");
		return entity.getBody();
	}
}
