package io.swagger.api.factories;

import io.swagger.api.RegionApiService;
import io.swagger.api.impl.RegionApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class RegionApiServiceFactory {
    private final static RegionApiService service = new RegionApiServiceImpl();

    public static RegionApiService getRegionApi() {
        return service;
    }
}
