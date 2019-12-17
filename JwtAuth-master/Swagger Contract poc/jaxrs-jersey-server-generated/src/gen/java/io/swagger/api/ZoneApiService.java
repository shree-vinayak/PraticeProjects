package io.swagger.api;

import io.swagger.api.*;
import io.swagger.model.*;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Zone;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.validation.constraints.*;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public abstract class ZoneApiService {
    public abstract Response addZone( @NotNull @Min(0) Integer idSubdivision,Zone body,SecurityContext securityContext) throws NotFoundException;
    public abstract Response deleteZone( @Min(0)Integer id,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getAllZone( @NotNull @Min(0) Integer idSubdivision, String name, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getZone( @Min(0)Integer id, Boolean populate,SecurityContext securityContext) throws NotFoundException;
    public abstract Response getZonesCount( @NotNull @Min(0) Integer idSubdivision,SecurityContext securityContext) throws NotFoundException;
    public abstract Response updateZone(Zone body,SecurityContext securityContext) throws NotFoundException;
}