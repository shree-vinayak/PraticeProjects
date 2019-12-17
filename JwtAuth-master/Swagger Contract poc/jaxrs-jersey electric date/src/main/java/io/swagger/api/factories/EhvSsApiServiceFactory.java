package io.swagger.api.factories;

import io.swagger.api.EhvSsApiService;
import io.swagger.api.impl.EhvSsApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class EhvSsApiServiceFactory {
    private final static EhvSsApiService service = new EhvSsApiServiceImpl();

    public static EhvSsApiService getEhvSsApi() {
        return service;
    }
}
