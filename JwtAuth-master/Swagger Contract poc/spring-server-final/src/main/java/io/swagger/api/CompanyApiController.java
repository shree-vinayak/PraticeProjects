package io.swagger.api;

import io.swagger.model.Company;
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
public class CompanyApiController implements CompanyApi {

    private static final Logger log = LoggerFactory.getLogger(CompanyApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public CompanyApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<Company> addCompany(@NotNull @Min(0)@ApiParam(value = "idState of the state to fetch companies for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idState", required = true) Integer idState,@ApiParam(value = ""  )  @Valid @RequestBody Company body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> deleteCompany(@Min(0)@ApiParam(value = "id of the company to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<Company>> getAllCompany(@NotNull @Min(0)@ApiParam(value = "idState of the state to fetch companies for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idState", required = true) Integer idState,@ApiParam(value = "if provided, returns the companies that match this name.") @Valid @RequestParam(value = "name", required = false) String name,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<Company>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<CountResponse> getCompaniesCount() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<CountResponse>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> getCompany(@Min(0)@ApiParam(value = "id of the company to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id,@ApiParam(value = "if true, populates all nested entities.") @Valid @RequestParam(value = "populate", required = false) Boolean populate) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> updateCompany(@ApiParam(value = ""  )  @Valid @RequestBody Company body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

}