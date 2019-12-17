package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Pole;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public abstract class PoleApiService {
    public abstract Response addPole(Pole body,SecurityContext securityContext) throws NotFoundException;
    public abstract Response disablePole( @Min(0)Integer id,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllPoles( Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getPoleById( @Min(0L)Long poleId, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updatePole(Pole body,SecurityContext securityContext) throws NotFoundException;
}
