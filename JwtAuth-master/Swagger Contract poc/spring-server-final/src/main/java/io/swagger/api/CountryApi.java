/**
 * NOTE: This class is auto generated by the swagger code generator program (3.0.8).
 * https://github.com/swagger-api/swagger-codegen
 * Do not edit the class manually.
 */
package io.swagger.api;

import io.swagger.model.Country;
import io.swagger.model.ErrorResponse;
import io.swagger.annotations.*;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.List;
import java.util.Map;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
@Api(value = "country", description = "the country API")
public interface CountryApi {

    @ApiOperation(value = "returns all countries.", nickname = "getAllCountries", notes = "get list of all countries", response = Country.class, responseContainer = "List", authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "general", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Ok", response = Country.class, responseContainer = "List"),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/country",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<List<Country>> getAllCountries(@ApiParam(value = "if provided, returns the countries that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate);


    @ApiOperation(value = "returns a country", nickname = "getCountry_", notes = "get details about a country", response = Country.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "general", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Ok", response = Country.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/country/{id}",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<Country> getCountry_(@Min(0)@ApiParam(value = "id of the country to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate);

}