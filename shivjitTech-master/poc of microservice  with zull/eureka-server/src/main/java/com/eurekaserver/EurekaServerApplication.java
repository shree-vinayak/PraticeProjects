package com.eurekaserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer  // Enable eureka server
public class EurekaServerApplication {

	private static final Logger LOGGER = LoggerFactory.getLogger(EurekaServerApplication.class);
	public static void main(String[] args) {
		LOGGER.info("Inside main method of EurekaServerApplication");
		SpringApplication.run(EurekaServerApplication.class, args);
	}
}
