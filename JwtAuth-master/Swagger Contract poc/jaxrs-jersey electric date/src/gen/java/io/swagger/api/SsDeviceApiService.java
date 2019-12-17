package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.ErrorResponse;
import io.swagger.model.SsDevice;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public abstract class SsDeviceApiService {
    public abstract Response addSsDevice(SsDevice body,SecurityContext securityContext) throws NotFoundException;
    public abstract Response disableSsDevice( @Min(0)Integer id, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllSsDevice( Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getSsDeviceById( @Min(0L)Long ssDeviceId, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updateSsDevice(SsDevice body,SecurityContext securityContext) throws NotFoundException;
}
