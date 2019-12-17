package io.swagger.api.factories;

import io.swagger.api.DtrDeviceApiService;
import io.swagger.api.impl.DtrDeviceApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class DtrDeviceApiServiceFactory {
    private final static DtrDeviceApiService service = new DtrDeviceApiServiceImpl();

    public static DtrDeviceApiService getDtrDeviceApi() {
        return service;
    }
}
