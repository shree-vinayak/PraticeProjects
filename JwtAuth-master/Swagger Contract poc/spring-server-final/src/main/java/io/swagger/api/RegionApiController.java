package io.swagger.api;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Region;
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
public class RegionApiController implements RegionApi {

    private static final Logger log = LoggerFactory.getLogger(RegionApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public RegionApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<Region> addRegion(@NotNull @Min(0)@ApiParam(value = "idCompany of the company to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idCompany", required = true) Integer idCompany,@ApiParam(value = ""  )  @Valid @RequestBody Region body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Region> deleteRegion(@Min(0)@ApiParam(value = "id of the region to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<Region>> getAllRegion(@NotNull @Min(0)@ApiParam(value = "idCompany of the company to fetch.", required = true, allowableValues = "") @Valid @RequestParam(value = "idCompany", required = true) Integer idCompany,@ApiParam(value = "if provided, returns the regions that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<Region>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Region> getRegion(@Min(0)@ApiParam(value = "id of the region to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<CountResponse> getRegionsCount(@NotNull @Min(0)@ApiParam(value = "Company Id of the company to count regions for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idCompany", required = true) Integer idCompany) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<CountResponse>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Region> updateRegion(@ApiParam(value = ""  )  @Valid @RequestBody Region body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

}
