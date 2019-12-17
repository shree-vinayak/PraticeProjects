package com.service.demo.routing;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.service.demo.interceptor.TenantContext;

public class CustomRoutingDataSource extends AbstractRoutingDataSource {
	
	public static final Logger LOGGER =LoggerFactory.getLogger(CustomRoutingDataSource.class);
	
	@Override
	protected Object determineCurrentLookupKey() {
		
//		ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//		if (attr != null) {
//			String tenantId = attr.getRequest().getParameter("tenantId"); // find parameter tenantId from @RequestParam
//			return tenantId;
//		} else {
//			return "tenantId2"; // default data source
//		}
		
		String tenantId= TenantContext.getCurrentTenant();
		if(Objects.nonNull(tenantId)) {
			return tenantId;
		}
		return "tenant_1";
	}
}