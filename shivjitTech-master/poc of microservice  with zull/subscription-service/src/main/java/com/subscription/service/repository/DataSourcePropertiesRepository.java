package com.subscription.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.subscription.service.entity.DataSourceProperties;

@Repository
public interface DataSourcePropertiesRepository extends JpaRepository<DataSourceProperties, Long>{

	DataSourceProperties findByDbName(String adminDbName);

}
