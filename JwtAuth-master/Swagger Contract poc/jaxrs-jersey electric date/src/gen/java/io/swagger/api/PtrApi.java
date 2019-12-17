package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.PtrApiService;
import io.swagger.api.factories.PtrApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Ptr;

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


@Path("/ptr")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class PtrApi  {
   private final PtrApiService delegate;

   public PtrApi(@Context ServletConfig servletContext) {
      PtrApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("PtrApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (PtrApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = PtrApiServiceFactory.getPtrApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Creates a ptr", description = "add details about a Ptr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Ptr.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addPtr(@Parameter(description = "" ,required=true) Ptr body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addPtr(body,securityContext);
    }
    @DELETE
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a boolean value", description = "Here it will set the isActive field false", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Boolean.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response disablePtr(@Parameter(description = "id of the Ptr to set isActive false.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.disablePtr(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns all ptr", description = "get details about all Ptr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Ptr.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllPtr(@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllPtr(populate,securityContext);
    }
    @GET
    @Path("/{ptrId}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a Ptr object", description = "get details about a Ptr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Ptr.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getPtrById(@Parameter(description = "id to get Ptr object",required=true, schema=@Schema(allowableValues={  })
) @PathParam("ptrId") Long ptrId
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getPtrById(ptrId,populate,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a updated Ptr", description = "update details about a Ptr", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Ptr.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updatePtr(@Parameter(description = "" ,required=true) Ptr body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updatePtr(body,securityContext);
    }
}
