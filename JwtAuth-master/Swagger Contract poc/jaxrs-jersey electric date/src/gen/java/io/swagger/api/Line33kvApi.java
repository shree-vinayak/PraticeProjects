package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.Line33kvApiService;
import io.swagger.api.factories.Line33kvApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Line33kv;

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


@Path("/line33kv")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-03T08:58:29.494Z[GMT]")public class Line33kvApi  {
   private final Line33kvApiService delegate;

   public Line33kvApi(@Context ServletConfig servletContext) {
      Line33kvApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("Line33kvApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (Line33kvApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = Line33kvApiServiceFactory.getLine33kvApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "Creates a Line33kv", description = "add details about a Line33kv", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Line33kv.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addLine33kv(@Parameter(description = "" ,required=true) Line33kv body

,@Parameter(description = "idEhvSS to fetch the EhvSS.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idEhvSs") Integer idEhvSs
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addLine33kv(body,idEhvSs,securityContext);
    }
    @DELETE
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a boolean value", description = "Here it will set the isActive field false", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Boolean.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response disableLine33kv(@Parameter(description = "id of the Line33kv to set isActive false.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.disableLine33kv(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns all Line33kv", description = "get details about all Line33kv", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Line33kv.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllLine33kv(@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllLine33kv(securityContext);
    }
    @GET
    @Path("/{line33kvId}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a Line33kv object", description = "get details about a Line33kvId", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Line33kv.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getLine33kvById(@Parameter(description = "id to get line33kv Object",required=true, schema=@Schema(allowableValues={  })
) @PathParam("line33kvId") Long line33kvId
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getLine33kvById(line33kvId,populate,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a updated Line33kv", description = "update details about a Line33kv", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "electrical" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Line33kv.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateLine33kv(@Parameter(description = "" ,required=true) Line33kv body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateLine33kv(body,securityContext);
    }
}
