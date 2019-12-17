package io.swagger.api.factories;

import io.swagger.api.CircleApiService;
import io.swagger.api.impl.CircleApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class CircleApiServiceFactory {
    private final static CircleApiService service = new CircleApiServiceImpl();

    public static CircleApiService getCircleApi() {
        return service;
    }
}
