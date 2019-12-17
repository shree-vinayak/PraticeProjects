package io.swagger.api;

import io.swagger.model.Circle;
import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.*;
import javax.validation.Valid;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Map;
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-06-01T10:15:14.735Z[GMT]")
@Controller
public class CircleApiController implements CircleApi {

    private static final Logger log = LoggerFactory.getLogger(CircleApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public CircleApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<Circle> addCircle(@NotNull @Min(0)@ApiParam(value = "idRegion of the region to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idRegion", required = true) Integer idRegion,@ApiParam(value = ""  )  @Valid @RequestBody Circle body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Circle> deleteCircle(@Min(0)@ApiParam(value = "id of the circle to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<Circle>> getAllCircle(@NotNull @Min(0)@ApiParam(value = "idRegion of the region to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idRegion", required = true) Integer idRegion,@ApiParam(value = "if provided, returns the circles that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<Circle>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Circle> getCircle(@Min(0)@ApiParam(value = "id of the circle to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<CountResponse> getCirclesCount(@NotNull @Min(0)@ApiParam(value = "Region Id of the region to count circles for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idRegion", required = true) Integer idRegion,@ApiParam(value = "if provided, returns the region that matches this name.") @Valid @RequestParam(value = "name", required = false) String name) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<CountResponse>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Circle> updateCircle(@ApiParam(value = ""  )  @Valid @RequestBody Circle body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

}
