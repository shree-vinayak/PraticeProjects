package io.swagger.api.factories;

import io.swagger.api.SsDeviceApiService;
import io.swagger.api.impl.SsDeviceApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class SsDeviceApiServiceFactory {
    private final static SsDeviceApiService service = new SsDeviceApiServiceImpl();

    public static SsDeviceApiService getSsDeviceApi() {
        return service;
    }
}
