package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Line33kv;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public abstract class Line33kvApiService {
    public abstract Response addLine33kv(Line33kv body, @NotNull @Min(0) Integer idEhvSs,SecurityContext securityContext) throws NotFoundException;
    public abstract Response disableLine33kv( @Min(0)Integer id,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllLine33kv(SecurityContext securityContext) throws NotFoundException;
    public abstract Response getLine33kvById( @Min(0L)Long line33kvId, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updateLine33kv(Line33kv body,SecurityContext securityContext) throws NotFoundException;
}
