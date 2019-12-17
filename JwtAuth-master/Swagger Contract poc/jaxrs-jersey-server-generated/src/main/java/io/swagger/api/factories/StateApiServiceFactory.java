package io.swagger.api.factories;

import io.swagger.api.StateApiService;
import io.swagger.api.impl.StateApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class StateApiServiceFactory {
    private final static StateApiService service = new StateApiServiceImpl();

    public static StateApiService getStateApi() {
        return service;
    }
}
