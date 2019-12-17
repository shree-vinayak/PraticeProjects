package io.swagger.api.factories;

import io.swagger.api.SubdivisionApiService;
import io.swagger.api.impl.SubdivisionApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class SubdivisionApiServiceFactory {
    private final static SubdivisionApiService service = new SubdivisionApiServiceImpl();

    public static SubdivisionApiService getSubdivisionApi() {
        return service;
    }
}
