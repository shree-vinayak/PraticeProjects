package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Feeder11kv;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public abstract class Feeder11kvApiService {
    public abstract Response addFeeder11kv(Feeder11kv body,SecurityContext securityContext) throws NotFoundException;
    public abstract Response disableFeeder11kv( @Min(0)Integer id,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllFeeder11kv( Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getFeeder11kvById( @Min(0L)Long feeder11kvId, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updateFeeder11kv(Feeder11kv body,SecurityContext securityContext) throws NotFoundException;
}
