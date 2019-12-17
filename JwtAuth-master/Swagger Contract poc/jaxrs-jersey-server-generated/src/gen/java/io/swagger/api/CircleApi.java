package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.CircleApiService;
import io.swagger.api.factories.CircleApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.Circle;
import io.swagger.model.CountResponse;
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

@Path("/circle")

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")
public class CircleApi {
	private final CircleApiService delegate;

	public CircleApi(@Context ServletConfig servletContext) {
		CircleApiService delegate = null;

		if (servletContext != null) {
			String implClass = servletContext.getInitParameter("CircleApi.implementation");
			if (implClass != null && !"".equals(implClass.trim())) {
				try {
					delegate = (CircleApiService) Class.forName(implClass).newInstance();
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}
		}

		if (delegate == null) {
			delegate = CircleApiServiceFactory.getCircleApi();
		}

		this.delegate = delegate;
	}

	@POST

	@Consumes({ "application/json" })
	@Produces({ "application/json" })
	@Operation(summary = "returns a circle", description = "add details about a circle", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Circle.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response addCircle(
			@Parameter(description = "idRegion of the region to fetch.", required = true, schema = @Schema(allowableValues = {})) @QueryParam("idRegion") Integer idRegion,
			@Parameter(description = "") Circle body

			, @Context SecurityContext securityContext) throws NotFoundException {
		return delegate.addCircle(idRegion, body, securityContext);
	}

	@DELETE
	@Path("/{id}")

	@Produces({ "application/json" })
	@Operation(summary = "returns a circle", description = "delete details about a circle", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Circle.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response deleteCircle(
			@Parameter(description = "id of the circle to fetch.", required = true, schema = @Schema(allowableValues = {})) @PathParam("id") Integer id,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.deleteCircle(id, securityContext);
	}

	@GET

	@Produces({ "application/json" })
	@Operation(summary = "returns a circle", description = "get details about all circle", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Circle.class)))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response getAllCircle(
			@Parameter(description = "idRegion of the region to fetch.", required = true, schema = @Schema(allowableValues = {})) @QueryParam("idRegion") Integer idRegion,
			@Parameter(description = "if provided, returns the circles that match this name.") @QueryParam("name") String name,
			@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.getAllCircle(idRegion, name, populate, securityContext);
	}

	@GET
	@Path("/{id}")

	@Produces({ "application/json" })
	@Operation(summary = "returns a circle", description = "get details about a circle", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Circle.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response getCircle(
			@Parameter(description = "id of the circle to fetch.", required = true, schema = @Schema(allowableValues = {})) @PathParam("id") Integer id,
			@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.getCircle(id, populate, securityContext);
	}

	@GET
	@Path("/count")

	@Produces({ "application/json" })
	@Operation(summary = "returns number of circles in a region", description = "get number of circles in a region", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Count for the requested entity.", content = @Content(schema = @Schema(implementation = CountResponse.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response getCirclesCount(
			@Parameter(description = "Region Id of the region to count circles for.", required = true, schema = @Schema(allowableValues = {})) @QueryParam("idRegion") Integer idRegion,
			@Parameter(description = "if provided, returns the region that matches this name.") @QueryParam("name") String name,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.getCirclesCount(idRegion, name, securityContext);
	}

	@PUT

	@Consumes({ "application/json" })
	@Produces({ "application/json" })
	@Operation(summary = "returns a circle", description = "update details about a circle", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Circle.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response updateCircle(@Parameter(description = "") Circle body

			, @Context SecurityContext securityContext) throws NotFoundException {
		return delegate.updateCircle(body, securityContext);
	}
}
