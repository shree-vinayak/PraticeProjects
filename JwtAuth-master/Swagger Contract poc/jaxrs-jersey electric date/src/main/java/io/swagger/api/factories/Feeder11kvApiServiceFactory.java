package io.swagger.api.factories;

import io.swagger.api.Feeder11kvApiService;
import io.swagger.api.impl.Feeder11kvApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class Feeder11kvApiServiceFactory {
    private final static Feeder11kvApiService service = new Feeder11kvApiServiceImpl();

    public static Feeder11kvApiService getFeeder11kvApi() {
        return service;
    }
}
