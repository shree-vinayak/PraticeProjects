package io.swagger.api.factories;

import io.swagger.api.DtrApiService;
import io.swagger.api.impl.DtrApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class DtrApiServiceFactory {
    private final static DtrApiService service = new DtrApiServiceImpl();

    public static DtrApiService getDtrApi() {
        return service;
    }
}
