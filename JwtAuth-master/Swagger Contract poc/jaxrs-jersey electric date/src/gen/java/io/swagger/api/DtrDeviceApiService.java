package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.DtrDevice;
import io.swagger.model.ErrorResponse;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public abstract class DtrDeviceApiService {
    public abstract Response addDtrDevice(DtrDevice body,SecurityContext securityContext) throws NotFoundException;
    public abstract Response disableDtrDevice( @Min(0)Integer id,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllDtrDevice( Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getDtrDeviceById( @Min(0L)Long dtrDeviceId, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updateDtrDevice(DtrDevice body,SecurityContext securityContext) throws NotFoundException;
}
