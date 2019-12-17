
package com.astute.iot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@SpringBootApplication

@ComponentScan(basePackages = { "com.astute.iot.service", "com.astute.iot.util", "com.astute.iot.controller" })
@EnableJpaRepositories(basePackages = { "com.astute.iot.repository", "com.astute.electrical.repository" })
@EntityScan(basePackages = { "com.astute.iot.model", "com.astute.report.model", "com.astute.electrical.models",
		"com.astute.discom.models" })
public class AstuteIOTBackend extends SpringBootServletInitializer {

	@Bean
	public CommonsRequestLoggingFilter requestLoggingFilter() {
		CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
		loggingFilter.setIncludeClientInfo(true);
		loggingFilter.setIncludeQueryString(true);
		loggingFilter.setIncludePayload(true);
		loggingFilter.setIncludeHeaders(true);
		return loggingFilter;
	}

	@Bean
	public Logger getLogger() {
		return LoggerFactory.getLogger(AstuteIOTBackend.class);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(AstuteIOTBackend.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(AstuteIOTBackend.class, args);
	}

}
