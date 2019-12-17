package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.Dtr;
import io.swagger.model.ErrorResponse;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public abstract class DtrApiService {
    public abstract Response addDtr(Dtr body,SecurityContext securityContext) throws NotFoundException;
    public abstract Response disableDtr( @Min(0)Integer id,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllDtr( Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getDtrById( @Min(0L)Long dtrId, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updateDtr(Dtr body,SecurityContext securityContext) throws NotFoundException;
}
