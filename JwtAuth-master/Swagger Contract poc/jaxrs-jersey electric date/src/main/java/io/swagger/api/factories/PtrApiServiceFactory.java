package io.swagger.api.factories;

import io.swagger.api.PtrApiService;
import io.swagger.api.impl.PtrApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class PtrApiServiceFactory {
    private final static PtrApiService service = new PtrApiServiceImpl();

    public static PtrApiService getPtrApi() {
        return service;
    }
}
