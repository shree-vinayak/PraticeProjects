package com.service.demo.routing;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import java.util.HashMap;
import java.util.Map;


public class MasterService {
	public static Map<Object, Object> getDataSourceHashMap() {

//data source for mysql			
		DriverManagerDataSource dataSource1 = new DriverManagerDataSource();
		dataSource1.setDriverClassName("com.mysql.cj.jdbc.Driver");
		dataSource1.setUrl("jdbc:mysql://localhost:3306/admin_40288a126dbedbd0016dbefe00dd0000");
		dataSource1.setUsername("root");
		dataSource1.setPassword("mysql");
		
		DriverManagerDataSource dataSource2 = new DriverManagerDataSource();
		dataSource2.setDriverClassName("com.mysql.cj.jdbc.Driver");
		dataSource2.setUrl("jdbc:mysql://localhost:3306/admin_40288a126dbedbd0016dbf00e6810001");
		dataSource2.setUsername("root");
		dataSource2.setPassword("mysql");
		
				
		Map<Object, Object> hashMap = new HashMap<>();
		hashMap.put("tenant_1", dataSource1);
		hashMap.put("tenant_2", dataSource2);
		return hashMap;
		
	}
}