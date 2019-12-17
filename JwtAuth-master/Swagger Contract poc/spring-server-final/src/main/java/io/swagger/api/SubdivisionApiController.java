package io.swagger.api;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Subdivision;
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
public class SubdivisionApiController implements SubdivisionApi {

    private static final Logger log = LoggerFactory.getLogger(SubdivisionApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public SubdivisionApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<Subdivision> addSubDivision(@NotNull @Min(0)@ApiParam(value = "idDivision of the division to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idDivision", required = true) Integer idDivision,@ApiParam(value = ""  )  @Valid @RequestBody Subdivision body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Subdivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Subdivision> deleteSubDivision(@Min(0)@ApiParam(value = "id of the Subdivision to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Subdivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<Subdivision>> getAllSubDivision(@NotNull @Min(0)@ApiParam(value = "idDivision of the division to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idDivision", required = true) Integer idDivision,@ApiParam(value = "if provided, returns the subdivisions that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<Subdivision>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Subdivision> getSubDivision(@Min(0)@ApiParam(value = "id of the subSubDivision to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Subdivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<CountResponse> getSubdivisionsCount(@NotNull @Min(0)@ApiParam(value = "Division Id of the division to count subdivisions for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idDivision", required = true) Integer idDivision) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<CountResponse>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Subdivision> updateSubDivision(@ApiParam(value = ""  )  @Valid @RequestBody Subdivision body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Subdivision>(HttpStatus.NOT_IMPLEMENTED);
    }

}
