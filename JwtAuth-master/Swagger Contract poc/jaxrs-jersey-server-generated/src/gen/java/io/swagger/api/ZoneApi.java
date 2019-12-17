package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.ZoneApiService;
import io.swagger.api.factories.ZoneApiServiceFactory;

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
import io.swagger.model.Zone;

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


@Path("/zone")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class ZoneApi  {
   private final ZoneApiService delegate;

   public ZoneApi(@Context ServletConfig servletContext) {
      ZoneApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("ZoneApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (ZoneApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = ZoneApiServiceFactory.getZoneApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a zone", description = "add details about a zone", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Zone.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addZone(@Parameter(description = "idSubdivision of the Subdivision to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idSubdivision") Integer idSubdivision
,@Parameter(description = "" ) Zone body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addZone(idSubdivision,body,securityContext);
    }
    @DELETE
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a zone", description = "delete details about a zone", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Zone.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response deleteZone(@Parameter(description = "id of the zone to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.deleteZone(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a zone", description = "get details about all zone", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "OK", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Zone.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllZone(@Parameter(description = "idSubdivision of the Subdivision to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idSubdivision") Integer idSubdivision
,@Parameter(description = "if provided, returns the zones that match this name.") @QueryParam("name") String name
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllZone(idSubdivision,name,populate,securityContext);
    }
    @GET
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a zone", description = "get details about a zone", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "OK", content = @Content(schema = @Schema(implementation = Zone.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getZone(@Parameter(description = "id of the zone to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getZone(id,populate,securityContext);
    }
    @GET
    @Path("/count")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns number of zones in a subdivision.", description = "get number of zones in a circle.", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Count for the requested entity.", content = @Content(schema = @Schema(implementation = CountResponse.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getZonesCount(@Parameter(description = "Subdivison Id of the subdivisoin to count zones for.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idSubdivision") Integer idSubdivision
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getZonesCount(idSubdivision,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a zone", description = "update details about a zone", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Zone.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateZone(@Parameter(description = "" ) Zone body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateZone(body,securityContext);
    }
}
