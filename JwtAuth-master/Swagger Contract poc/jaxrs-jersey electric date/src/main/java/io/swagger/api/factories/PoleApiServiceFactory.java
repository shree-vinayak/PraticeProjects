package io.swagger.api.factories;

import io.swagger.api.PoleApiService;
import io.swagger.api.impl.PoleApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class PoleApiServiceFactory {
    private final static PoleApiService service = new PoleApiServiceImpl();

    public static PoleApiService getPoleApi() {
        return service;
    }
}
