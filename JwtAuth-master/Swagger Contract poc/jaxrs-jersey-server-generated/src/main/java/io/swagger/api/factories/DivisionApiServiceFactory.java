package io.swagger.api.factories;

import io.swagger.api.DivisionApiService;
import io.swagger.api.impl.DivisionApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class DivisionApiServiceFactory {
    private final static DivisionApiService service = new DivisionApiServiceImpl();

    public static DivisionApiService getDivisionApi() {
        return service;
    }
}
