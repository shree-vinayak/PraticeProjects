package io.swagger.api.factories;

import io.swagger.api.CountryApiService;
import io.swagger.api.impl.CountryApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class CountryApiServiceFactory {
    private final static CountryApiService service = new CountryApiServiceImpl();

    public static CountryApiService getCountryApi() {
        return service;
    }
}
