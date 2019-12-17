package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.DtrApiService;
import io.swagger.api.factories.DtrApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.Dtr;
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


@Path("/dtr")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class DtrApi  {
   private final DtrApiService delegate;

   public DtrApi(@Context ServletConfig servletContext) {
      DtrApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("DtrApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (DtrApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = DtrApiServiceFactory.getDtrApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Creates a Dtr", description = "add details about a Dtr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Dtr.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addDtr(@Parameter(description = "" ,required=true) Dtr body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addDtr(body,securityContext);
    }
    @DELETE
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a boolean value", description = "Here it will set the isActive field false", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Boolean.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response disableDtr(@Parameter(description = "id of the Dtr to set isActive false.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.disableDtr(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns all Dtr", description = "get details about all Dtr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Dtr.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllDtr(@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllDtr(populate,securityContext);
    }
    @GET
    @Path("/{dtrId}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a Dtr object", description = "get details about a Dtr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Dtr.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getDtrById(@Parameter(description = "id to get Dtr object",required=true, schema=@Schema(allowableValues={  })
) @PathParam("dtrId") Long dtrId
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getDtrById(dtrId,populate,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a updated Dtr", description = "update details about a Dtr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Dtr.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateDtr(@Parameter(description = "" ,required=true) Dtr body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateDtr(body,securityContext);
    }
}
