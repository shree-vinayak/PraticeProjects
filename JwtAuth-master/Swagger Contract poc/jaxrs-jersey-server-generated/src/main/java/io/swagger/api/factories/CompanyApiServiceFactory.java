package io.swagger.api.factories;

import io.swagger.api.CompanyApiService;
import io.swagger.api.impl.CompanyApiServiceImpl;

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class CompanyApiServiceFactory {
    private final static CompanyApiService service = new CompanyApiServiceImpl();

    public static CompanyApiService getCompanyApi() {
        return service;
    }
}
