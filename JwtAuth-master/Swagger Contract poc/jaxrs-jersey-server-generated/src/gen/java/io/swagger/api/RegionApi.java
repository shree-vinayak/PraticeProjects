package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.RegionApiService;
import io.swagger.api.factories.RegionApiServiceFactory;

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
import io.swagger.model.Region;

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


@Path("/region")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class RegionApi  {
   private final RegionApiService delegate;

   public RegionApi(@Context ServletConfig servletContext) {
      RegionApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("RegionApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (RegionApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = RegionApiServiceFactory.getRegionApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a region", description = "add details about a region", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Region.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addRegion(@Parameter(description = "idCompany of the company to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCompany") Integer idCompany
,@Parameter(description = "" ) Region body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addRegion(idCompany,body,securityContext);
    }
    @DELETE
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a region", description = "delete details about a region", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Region.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response deleteRegion(@Parameter(description = "id of the region to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.deleteRegion(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a region", description = "get details about all region", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Region.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllRegion(@Parameter(description = "idCompany of the company to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCompany") Integer idCompany
,@Parameter(description = "if provided, returns the regions that match this name.") @QueryParam("name") String name
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllRegion(idCompany,name,populate,securityContext);
    }
    @GET
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a region", description = "get details about a region", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Region.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getRegion(@Parameter(description = "id of the region to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getRegion(id,populate,securityContext);
    }
    @GET
    @Path("/count")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns number of regions in a company.", description = "get number of regions in a company.", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Count for the requested entity.", content = @Content(schema = @Schema(implementation = CountResponse.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getRegionsCount(@Parameter(description = "Company Id of the company to count regions for.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCompany") Integer idCompany
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getRegionsCount(idCompany,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a region", description = "update details about a region", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Region.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateRegion(@Parameter(description = "" ) Region body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateRegion(body,securityContext);
    }
}
