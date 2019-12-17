package com.aartek.tenant;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.aartek.tenant.routing.CustomRoutingDataSource;
import com.aartek.tenant.routing.MasterService;

//Example-link
//https://javadeveloperzone.com/spring-boot/spring-boot-jpa-multi-tenancy-example/

@SpringBootApplication
public class SpringBootMultiTenancyWithMysqlApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringBootMultiTenancyWithMysqlApplication.class, args);
	}

	@Bean
	public DataSource dataSource() {
		CustomRoutingDataSource customDataSource = new CustomRoutingDataSource();
		customDataSource.setTargetDataSources(MasterService.getDataSourceHashMap());
		return customDataSource;
	}
}
