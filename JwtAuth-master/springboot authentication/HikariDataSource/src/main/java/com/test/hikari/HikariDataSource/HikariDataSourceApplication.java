package com.test.hikari.HikariDataSource;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.test.hikari.HikariDataSource")
public class HikariDataSourceApplication   implements CommandLineRunner  {

	@Autowired
	DataSource dataSource;

	public static void main(String[] args) {
		SpringApplication.run(HikariDataSourceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		System.out.println("DATASOURCE = " + dataSource);
		System.out.println("done");

	}

}
