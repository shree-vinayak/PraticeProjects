package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.DivisionApiService;
import io.swagger.api.factories.DivisionApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.CountResponse;
import io.swagger.model.Division;
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


@Path("/division")


@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")public class DivisionApi  {
   private final DivisionApiService delegate;

   public DivisionApi(@Context ServletConfig servletContext) {
      DivisionApiService delegate = null;

      if (servletContext != null) {
         String implClass = servletContext.getInitParameter("DivisionApi.implementation");
         if (implClass != null && !"".equals(implClass.trim())) {
            try {
               delegate = (DivisionApiService) Class.forName(implClass).newInstance();
            } catch (Exception e) {
               throw new RuntimeException(e);
            }
         } 
      }

      if (delegate == null) {
         delegate = DivisionApiServiceFactory.getDivisionApi();
      }

      this.delegate = delegate;
   }

    @POST
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a division", description = "add details about a division", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Division.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response addDivision(@Parameter(description = "idCircle of the circle to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCircle") Integer idCircle
,@Parameter(description = "" ) Division body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.addDivision(idCircle,body,securityContext);
    }
    @DELETE
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a division", description = "delete details about a division", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Division.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response deleteDivision(@Parameter(description = "id of the division to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.deleteDivision(id,securityContext);
    }
    @GET
    
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a division", description = "get details about all division", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Division.class)))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getAllDivision(@Parameter(description = "idCircle of the circle to fetch.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCircle") Integer idCircle
,@Parameter(description = "if provided, returns the divisions that match this name.") @QueryParam("name") String name
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getAllDivision(idCircle,name,populate,securityContext);
    }
    @GET
    @Path("/{id}")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns a division", description = "get details about a division", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Division.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getDivision(@Parameter(description = "id of the division to fetch.",required=true, schema=@Schema(allowableValues={  })
) @PathParam("id") Integer id
,@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getDivision(id,populate,securityContext);
    }
    @GET
    @Path("/count")
    
    @Produces({ "application/json" })
    @Operation(summary = "returns number of divisions in a circle.", description = "get number of divisions in a circle.", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "200", description = "Count for the requested entity.", content = @Content(schema = @Schema(implementation = CountResponse.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response getDivisionsCount(@Parameter(description = "Circle Id of the circle to count divisions for.",required=true, schema=@Schema(allowableValues={  })
) @QueryParam("idCircle") Integer idCircle
,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.getDivisionsCount(idCircle,securityContext);
    }
    @PUT
    
    @Consumes({ "application/json" })
    @Produces({ "application/json" })
    @Operation(summary = "returns a division", description = "update details about a division", security = {
        @SecurityRequirement(name = "BearerAuth")    }, tags={ "discom" })
    @ApiResponses(value = { 
        @ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Division.class))),
        
        @ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        
        @ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
    public Response updateDivision(@Parameter(description = "" ) Division body

,@Context SecurityContext securityContext)
    throws NotFoundException {
        return delegate.updateDivision(body,securityContext);
    }
}
