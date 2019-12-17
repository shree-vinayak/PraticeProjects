package io.swagger.api.factories;

import io.swagger.api.ZoneApiService;
import io.swagger.api.impl.ZoneApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class ZoneApiServiceFactory {
    private final static ZoneApiService service = new ZoneApiServiceImpl();

    public static ZoneApiService getZoneApi() {
        return service;
    }
}
