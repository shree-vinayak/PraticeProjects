package io.swagger.api.factories;

import io.swagger.api.Line33kvApiService;
import io.swagger.api.impl.Line33kvApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class Line33kvApiServiceFactory {
    private final static Line33kvApiService service = new Line33kvApiServiceImpl();

    public static Line33kvApiService getLine33kvApi() {
        return service;
    }
}
