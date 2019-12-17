/**
 * NOTE: This class is auto generated by the swagger code generator program (3.0.8).
 * https://github.com/swagger-api/swagger-codegen
 * Do not edit the class manually.
 */
package io.swagger.api;

import io.swagger.model.Circle;
import io.swagger.model.CountResponse;
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
@Api(value = "circle", description = "the circle API")
public interface CircleApi {

    @ApiOperation(value = "returns a circle", nickname = "addCircle", notes = "add details about a circle", response = Circle.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 201, message = "Created", response = Circle.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/circle",
        produces = { "application/json" }, 
        consumes = { "application/json" },
        method = RequestMethod.POST)
    ResponseEntity<Circle> addCircle(@NotNull @Min(0)@ApiParam(value = "idRegion of the region to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idRegion", required = true) Integer idRegion,@ApiParam(value = ""  )  @Valid @RequestBody Circle body);


    @ApiOperation(value = "returns a circle", nickname = "deleteCircle", notes = "delete details about a circle", response = Circle.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 202, message = "Accepted", response = Circle.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/circle/{id}",
        produces = { "application/json" }, 
        method = RequestMethod.DELETE)
    ResponseEntity<Circle> deleteCircle(@Min(0)@ApiParam(value = "id of the circle to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id);


    @ApiOperation(value = "returns a circle", nickname = "getAllCircle", notes = "get details about all circle", response = Circle.class, responseContainer = "List", authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Ok", response = Circle.class, responseContainer = "List"),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/circle",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<List<Circle>> getAllCircle(@NotNull @Min(0)@ApiParam(value = "idRegion of the region to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idRegion", required = true) Integer idRegion,@ApiParam(value = "if provided, returns the circles that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate);


    @ApiOperation(value = "returns a circle", nickname = "getCircle", notes = "get details about a circle", response = Circle.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Ok", response = Circle.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/circle/{id}",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<Circle> getCircle(@Min(0)@ApiParam(value = "id of the circle to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate);


    @ApiOperation(value = "returns number of circles in a region", nickname = "getCirclesCount", notes = "get number of circles in a region", response = CountResponse.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 200, message = "Count for the requested entity.", response = CountResponse.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/circle/count",
        produces = { "application/json" }, 
        method = RequestMethod.GET)
    ResponseEntity<CountResponse> getCirclesCount(@NotNull @Min(0)@ApiParam(value = "Region Id of the region to count circles for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idRegion", required = true) Integer idRegion,@ApiParam(value = "if provided, returns the region that matches this name.") @Valid @RequestParam(value = "name", required = false) String name);


    @ApiOperation(value = "returns a circle", nickname = "updateCircle", notes = "update details about a circle", response = Circle.class, authorizations = {
        @Authorization(value = "BearerAuth")    }, tags={ "discom", })
    @ApiResponses(value = { 
        @ApiResponse(code = 202, message = "Accepted", response = Circle.class),
        @ApiResponse(code = 401, message = "Access token is missing or invalid.", response = ErrorResponse.class),
        @ApiResponse(code = 404, message = "The specified resource was not found.", response = ErrorResponse.class) })
    @RequestMapping(value = "/circle",
        produces = { "application/json" }, 
        consumes = { "application/json" },
        method = RequestMethod.PUT)
    ResponseEntity<Circle> updateCircle(@ApiParam(value = ""  )  @Valid @RequestBody Circle body);

}