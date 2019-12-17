package com.subscription.service.service;

import com.subscription.service.entity.DataSourceProperties;
import com.subscription.service.result.ResultWrapper;

public interface DataSourceConfigService {

	ResultWrapper<DataSourceProperties> configureDataSource(String id);

}
