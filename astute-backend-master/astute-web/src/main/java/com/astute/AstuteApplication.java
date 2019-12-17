package com.astute;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import com.astute.auth.config.AuditAwareImpl;

@SpringBootApplication
@ComponentScan(basePackages = { "com.astute.auth.serviceImpl", "com.astute.discom.adaptor",
		"com.astute.electrical.adaptor", "com.astute.util", "com.astute.api", "com.astute.api.discom.impl",
		"com.astute.api.electrical.impl", "com.astute.auth.config", "com.astute.auth.controller",
		"com.astute.iot.controller", "com.astute.iot.service", "com.astute.iot.util", "com.astute.report.service" })
@EnableJpaRepositories(basePackages = { "com.astute.discom.repository", "com.astute.electrical.repository",
		"com.astute.auth.repository", "com.astute.iot.repository" })
@EntityScan(basePackages = { "com.astute.discom.models", "com.astute.electrical.models", "com.astute.auth.model",
		"com.astute.iot.model", "com.astute.report.model" })
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class AstuteApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(AstuteApplication.class);
	}

	public static void main(String[] args) throws Exception {
		SpringApplication.run(AstuteApplication.class, args);
	}

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

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
		return LoggerFactory.getLogger(AstuteApplication.class);
	}

	@Bean
	public AuditorAware<String> auditorAware() {
		return new AuditAwareImpl();
	}

//	@Bean
//	public DataSource dataSource() throws SQLException {
//		HikariDataSource dataSource = new HikariDataSource();
//		dataSource.setPoolName("dataSource_" + UUID.randomUUID().toString());
//		return dataSource;
//	}
//
//	@Bean
//	@ConditionalOnMissingBean(value = ObjectNamingStrategy.class, search = SearchStrategy.CURRENT)
//	public ParentAwareNamingStrategy objectNamingStrategy() {
//		ParentAwareNamingStrategy namingStrategy = new ParentAwareNamingStrategy(new AnnotationJmxAttributeSource());
//		namingStrategy.setDefaultDomain("domain_" + UUID.randomUUID().toString());
//		return namingStrategy;
//	}

//	@Bean(name = "mvcHandlerMappingIntrospector")
//	public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
//		return new HandlerMappingIntrospector();
//	}
//
//	@Bean
//	public JavaMailSender getJavaMailSender() {
//		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
//		mailSender.setHost("smtp.gmail.com");
//		mailSender.setPort(587);
//
//		mailSender.setUsername("astuteenergyind");
//		mailSender.setPassword("ast@1234");
//
//		Properties props = mailSender.getJavaMailProperties();
//		props.put("mail.transport.protocol", "smtp");
//		props.put("mail.smtp.auth", "true");
//		props.put("mail.smtp.starttls.enable", "true");
//		props.put("mail.debug", "true");
//
//		return mailSender;
//	}

}
