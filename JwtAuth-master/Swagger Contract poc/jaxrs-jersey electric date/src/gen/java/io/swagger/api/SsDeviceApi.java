package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.SsDeviceApiService;
import io.swagger.api.factories.SsDeviceApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.ErrorResponse;
import io.swagger.model.SsDevice;

import java.util.Map;
import java.util.List;
import io.swagger.api.NotFoundException;

import java.io.InputStream;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.ServletConfig;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.*;
import javax.validation.constraints.*;


@Path("/ssDevice")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class SsDeviceApi  {
   private final SsDeviceApiService delegate;

   public SsDeviceApi(@Context ServletConfig servletContext) {
      SsDeviceApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("SsDeviceApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (SsDeviceApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = SsDeviceApiServiceFactory.getSsDeviceApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Creates a SsDevice", description = "add details about a SsDevice", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = SsDevice.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addSsDevice(@Parameter(description = "" ,required=true) SsDevice body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addSsDevice(body,securityContext);
    }
    @DELETE
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a boolean value", description = "Here it will set the isActive field false", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Boolean.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response disableSsDevice(@Parameter(description = "id of the SsDevice to set isActive false.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.disableSsDevice(id,populate,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns all ssDevice", description = "get details about all SsDevice", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = SsDevice.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllSsDevice(@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllSsDevice(populate,securityContext);
    }
    @GET
    @Path("/{ssDeviceId}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a Line33kv object", description = "get details about a SsDevice", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = SsDevice.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getSsDeviceById(@Parameter(description = "id to get SsDevice object",required=true, schema=@Schema(allowableValues={  })
) @PathParam("ssDeviceId") Long ssDeviceId
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getSsDeviceById(ssDeviceId,populate,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a updated SsDevice", description = "update details about a SsDevice", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = SsDevice.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateSsDevice(@Parameter(description = "" ,required=true) SsDevice body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateSsDevice(body,securityContext);
    }
}
