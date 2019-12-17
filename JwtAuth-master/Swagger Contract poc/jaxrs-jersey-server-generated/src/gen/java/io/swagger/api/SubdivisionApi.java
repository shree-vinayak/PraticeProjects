package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.SubdivisionApiService;
import io.swagger.api.factories.SubdivisionApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Subdivision;

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


@Path("/subdivision")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class SubdivisionApi  {
   private final SubdivisionApiService delegate;

   public SubdivisionApi(@Context ServletConfig servletContext) {
      SubdivisionApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("SubdivisionApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (SubdivisionApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = SubdivisionApiServiceFactory.getSubdivisionApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a Subdivision", description = "add details about a Subdivision", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Subdivision.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addSubDivision(@Parameter(description = "idDivision of the division to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idDivision") Integer idDivision
,@Parameter(description = "" ) Subdivision body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addSubDivision(idDivision,body,securityContext);
    }
    @DELETE
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a Subdivision", description = "delete details about a Subdivision", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "OK", content = @Content(schema = @Schema(implementation = Subdivision.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response deleteSubDivision(@Parameter(description = "id of the Subdivision to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.deleteSubDivision(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a Subdivision", description = "get details about all Subdivision", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "OK", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Subdivision.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllSubDivision(@Parameter(description = "idDivision of the division to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idDivision") Integer idDivision
,@Parameter(description = "if provided, returns the subdivisions that match this name.") @QueryParam("name") String name
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllSubDivision(idDivision,name,populate,securityContext);
    }
    @GET
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a subSubDivision", description = "get details about a subSubDivision", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "OK", content = @Content(schema = @Schema(implementation = Subdivision.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getSubDivision(@Parameter(description = "id of the subSubDivision to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getSubDivision(id,populate,securityContext);
    }
    @GET
    @Path("/count")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns number of subdivisions in a division.", description = "get number of subdivisions in a division.", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Count for the requested entity.", content = @Content(schema = @Schema(implementation = CountResponse.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getSubdivisionsCount(@Parameter(description = "Division Id of the division to count subdivisions for.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idDivision") Integer idDivision
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getSubdivisionsCount(idDivision,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a Subdivision", description = "update details about a subSubDivision", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Subdivision.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateSubDivision(@Parameter(description = "" ) Subdivision body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateSubDivision(body,securityContext);
    }
}
