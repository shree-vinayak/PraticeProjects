package io.swagger.api.factories;

import io.swagger.api.SubstationApiService;
import io.swagger.api.impl.SubstationApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class SubstationApiServiceFactory {
    private final static SubstationApiService service = new SubstationApiServiceImpl();

    public static SubstationApiService getSubstationApi() {
        return service;
    }
}
