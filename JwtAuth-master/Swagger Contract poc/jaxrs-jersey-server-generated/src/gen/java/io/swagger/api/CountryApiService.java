package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.Country;
import io.swagger.model.ErrorResponse;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public abstract class CountryApiService {
    public abstract Response getAllCountries( String name, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getCountry_( @Min(0)Integer id, Boolean populate,SecurityContext securityContext) throws NotFoundException;
}
