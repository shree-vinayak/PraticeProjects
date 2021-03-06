/**
 * NOTE: This class is auto generated by the swagger code generator program (3.0.8).
 * https://github.com/swagger-api/swagger-codegen
 * Do not edit the class manually.
 */
package io.swagger.api;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Subdivision;
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
@Api(value = "subdivision", description = "the subdivision API")
public interface SubdivisionApi {

    @ApiOperation(value = "returns a Subdivision", nickname = "addSubDivision", notes = "add details about a Subdivision", response = Subdivision.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 201, message = "Created", response = Subdivision.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/subdivision",
        produces = { "application/json" }, 
        consumes = { "application/json" },
        method = RequestMethod.POST)
    ResponseEntity<Subdivision> addSubDivision(@NotNull @Min(0)@ApiParam(value = "idDivision of the division to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idDivision", required = true) Integer idDivision,@ApiParam(value = ""  )  @Valid @RequestBody Subdivision body);


    @ApiOperation(value = "returns a Subdivision", nickname = "deleteSubDivision", notes = "delete details about a Subdivision", response = Subdivision.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "OK", response = Subdivision.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/subdivision/{id}",
        produces = { "application/json" }, 
        method = RequestMethod.DELETE)
    ResponseEntity<Subdivision> deleteSubDivision(@Min(0)@ApiParam(value = "id of the Subdivision to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id);


    @ApiOperation(value = "returns a Subdivision", nickname = "getAllSubDivision", notes = "get details about all Subdivision", response = Subdivision.class, responseContainer = "List", authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "OK", response = Subdivision.class, responseContainer = "List"),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/subdivision",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<List<Subdivision>> getAllSubDivision(@NotNull @Min(0)@ApiParam(value = "idDivision of the division to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idDivision", required = true) Integer idDivision,@ApiParam(value = "if provided, returns the subdivisions that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate);


    @ApiOperation(value = "returns a subSubDivision", nickname = "getSubDivision", notes = "get details about a subSubDivision", response = Subdivision.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "OK", response = Subdivision.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/subdivision/{id}",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<Subdivision> getSubDivision(@Min(0)@ApiParam(value = "id of the subSubDivision to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate);


    @ApiOperation(value = "returns number of subdivisions in a division.", nickname = "getSubdivisionsCount", notes = "get number of subdivisions in a division.", response = CountResponse.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Count for the requested entity.", response = CountResponse.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/subdivision/count",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<CountResponse> getSubdivisionsCount(@NotNull @Min(0)@ApiParam(value = "Division Id of the division to count subdivisions for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idDivision", required = true) Integer idDivision);


    @ApiOperation(value = "returns a Subdivision", nickname = "updateSubDivision", notes = "update details about a subSubDivision", response = Subdivision.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 202, message = "Accepted", response = Subdivision.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/subdivision",
        produces = { "application/json" }, 
        consumes = { "application/json" },
        method = RequestMethod.PUT)
    ResponseEntity<Subdivision> updateSubDivision(@ApiParam(value = ""  )  @Valid @RequestBody Subdivision body);

}
