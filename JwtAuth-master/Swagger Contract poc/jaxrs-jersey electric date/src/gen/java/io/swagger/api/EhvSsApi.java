package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.EhvSsApiService;
import io.swagger.api.factories.EhvSsApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.EhvSs;
import io.swagger.model.ErrorResponse;

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


@Path("/ehvSs")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class EhvSsApi  {
   private final EhvSsApiService delegate;

   public EhvSsApi(@Context ServletConfig servletContext) {
      EhvSsApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("EhvSsApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (EhvSsApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = EhvSsApiServiceFactory.getEhvSsApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Creates a EhvSs", description = "add details about a EhvSs", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = EhvSs.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addEhvSs(@Parameter(description = "" ,required=true) EhvSs body

,@Parameter(description = "idCircle to fetch the circle.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCircle") Integer idCircle
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addEhvSs(body,idCircle,securityContext);
    }
    @DELETE
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a boolean value", description = "Here it will set the isActive field false", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Boolean.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response disableEhvSs(@Parameter(description = "id of the EhvSs to set isActive false",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.disableEhvSs(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns all EhvSs", description = "get details about all ehvSs", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = EhvSs.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllEhvSs(@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllEhvSs(securityContext);
    }
    @GET
    @Path("/{ehvId}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a ehv object", description = "get details about a Ehv", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = EhvSs.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getEhvById(@Parameter(description = "id of the Ehv to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("ehvId") Long ehvId
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getEhvById(ehvId,populate,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a updated EhvSs", description = "update details about a EhvSs", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = EhvSs.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateEhvSs(@Parameter(description = "" ,required=true) EhvSs body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateEhvSs(body,securityContext);
    }
}
