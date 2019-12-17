package io.swagger.api.factories;

import io.swagger.api.PoleDeviceApiService;
import io.swagger.api.impl.PoleDeviceApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class PoleDeviceApiServiceFactory {
    private final static PoleDeviceApiService service = new PoleDeviceApiServiceImpl();

    public static PoleDeviceApiService getPoleDeviceApi() {
        return service;
    }
}
