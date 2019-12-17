package com.aartek.tenant.routing;

import org.springframework.jdbc.datasource.DriverManagerDataSource;
import java.util.HashMap;
import java.util.Map;


public class MasterService {
	public static Map<Object, Object> getDataSourceHashMap() {

//////data source for postgres			
//		DriverManagerDataSource dataSource1 = new DriverManagerDataSource();
//		dataSource1.setDriverClassName("com.mysql.cj.jdbc.Driver");
//		dataSource1.setUrl("jdbc:mysql://localhost:3306/demo_database_1");
//		dataSource1.setUsername("root");
//		dataSource1.setPassword("root");
//		
//		DriverManagerDataSource dataSource2 = new DriverManagerDataSource();
//		dataSource2.setDriverClassName("com.mysql.cj.jdbc.Driver");
//		dataSource2.setUrl("jdbc:mysql://localhost:3306/demo_database_2");
//		dataSource2.setUsername("root");
//		dataSource2.setPassword("root");
//		
//		DriverManagerDataSource dataSource3 = new DriverManagerDataSource();
//		dataSource3.setDriverClassName("com.mysql.cj.jdbc.Driver");
//		dataSource3.setUrl("jdbc:mysql://localhost:3306/demo_database_3");
//		dataSource3.setUsername("root");
//		dataSource3.setPassword("root");
//		
//		Map<Object, Object> hashMap = new HashMap<>();
//		hashMap.put("tenantId1", dataSource1);
//		hashMap.put("tenantId2", dataSource2);
//		hashMap.put("tenantId3", dataSource3);
//		return hashMap;
		
////data source for postgres		
		DriverManagerDataSource dataSource1 = new DriverManagerDataSource();
		dataSource1.setDriverClassName("org.postgresql.ds.PGSimpleDataSource");
		dataSource1.setUrl("jdbc:postgresql://127.0.0.1:5432/sampledb");
		dataSource1.setUsername("philipp");
		dataSource1.setPassword("test_pwd");
		
		DriverManagerDataSource dataSource2 = new DriverManagerDataSource();
		dataSource2.setDriverClassName("org.postgresql.ds.PGSimpleDataSource");
		dataSource2.setUrl("jdbc:postgresql://127.0.0.1:5432/sampledb2");
		dataSource2.setUsername("philipp");
		dataSource2.setPassword("test_pwd");
		
		Map<Object, Object> hashMap = new HashMap<>();
		hashMap.put("tenantId1", dataSource1);
		hashMap.put("tenantId2", dataSource2);
		return hashMap;
	}
}