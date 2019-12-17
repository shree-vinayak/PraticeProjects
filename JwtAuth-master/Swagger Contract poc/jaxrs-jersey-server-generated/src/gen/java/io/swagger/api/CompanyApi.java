package io.swagger.api;

import io.swagger.model.*;
import io.swagger.api.CompanyApiService;
import io.swagger.api.factories.CompanyApiServiceFactory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import io.swagger.model.Company;
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

@Path("/company")

@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.JavaJerseyServerCodegen", date = "2019-06-01T10:04:14.100Z[GMT]")
public class CompanyApi {
	private final CompanyApiService delegate;

	public CompanyApi(@Context ServletConfig servletContext) {
		CompanyApiService delegate = null;

		if (servletContext != null) {
			String implClass = servletContext.getInitParameter("CompanyApi.implementation");
			if (implClass != null && !"".equals(implClass.trim())) {
				try {
					delegate = (CompanyApiService) Class.forName(implClass).newInstance();
				} catch (Exception e) {
					throw new RuntimeException(e);
				}
			}
		}

		if (delegate == null) {
			delegate = CompanyApiServiceFactory.getCompanyApi();
		}

		this.delegate = delegate;
	}

	@POST

	@Consumes({ "application/json" })
	@Produces({ "application/json" })
	@Operation(summary = "returns a company", description = "add details about a company", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "201", description = "Created", content = @Content(schema = @Schema(implementation = Company.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response addCompany(
			@Parameter(description = "idState of the state to fetch companies for.", required = true, schema = @Schema(allowableValues = {})) @QueryParam("idState") Integer idState,
			@Parameter(description = "") Company body

			, @Context SecurityContext securityContext) throws NotFoundException {
		return delegate.addCompany(idState, body, securityContext);
	}

	@DELETE
	@Path("/{id}")

	@Produces({ "application/json" })
	@Operation(summary = "returns a company", description = "delete details about a company", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Company.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response deleteCompany(
			@Parameter(description = "id of the company to fetch.", required = true, schema = @Schema(allowableValues = {})) @PathParam("id") Integer id,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.deleteCompany(id, securityContext);
	}

	@GET

	@Produces({ "application/json" })
	@Operation(summary = "returns a company", description = "get details about all company", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Ok", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Company.class)))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response getAllCompany(
			@Parameter(description = "idState of the state to fetch companies for.", required = true, schema = @Schema(allowableValues = {})) @QueryParam("idState") Integer idState,
			@Parameter(description = "if provided, returns the companies that match this name.") @QueryParam("name") String name,
			@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.getAllCompany(idState, name, populate, securityContext);
	}

	@GET
	@Path("/count")

	@Produces({ "application/json" })
	@Operation(summary = "returns number of companies", description = "get number of companies", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Count for the requested entity.", content = @Content(schema = @Schema(implementation = CountResponse.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response getCompaniesCount(@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.getCompaniesCount(securityContext);
	}

	@GET
	@Path("/{id}")

	@Produces({ "application/json" })
	@Operation(summary = "returns a company", description = "get details about a company", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "Ok", content = @Content(schema = @Schema(implementation = Company.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response getCompany(
			@Parameter(description = "id of the company to fetch.", required = true, schema = @Schema(allowableValues = {})) @PathParam("id") Integer id,
			@Parameter(description = "if true, populates all nested entities.") @QueryParam("populate") Boolean populate,
			@Context SecurityContext securityContext) throws NotFoundException {
		return delegate.getCompany(id, populate, securityContext);
	}

	@PUT

	@Consumes({ "application/json" })
	@Produces({ "application/json" })
	@Operation(summary = "returns a company", description = "update details about a company", security = {
			@SecurityRequirement(name = "BearerAuth") }, tags = { "discom" })
	@ApiResponses(value = {
			@ApiResponse(responseCode = "202", description = "Accepted", content = @Content(schema = @Schema(implementation = Company.class))),

			@ApiResponse(responseCode = "401", description = "Access token is missing or invalid.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),

			@ApiResponse(responseCode = "404", description = "The specified resource was not found.", content = @Content(schema = @Schema(implementation = ErrorResponse.class))) })
	public Response updateCompany(@Parameter(description = "") Company body

			, @Context SecurityContext securityContext) throws NotFoundException {
		return delegate.updateCompany(body, securityContext);
	}
}
