package io.swagger.api;

import io.swagger.model.EhvSs;
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
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-29T11:33:53.105Z[GMT]")
@Controller
public class EhvSsApiController implements EhvSsApi {

    private static final Logger log = LoggerFactory.getLogger(EhvSsApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public EhvSsApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<EhvSs> addEhvSs(@ApiParam(value = "" ,required=true )  @Valid @RequestBody EhvSs body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<EhvSs>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<Boolean>> disableEhvSs(@Min(0)@ApiParam(value = "id of the EhvSs to Disable isActive.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<Boolean>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<EhvSs>> getAllEhvSs() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<EhvSs>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<EhvSs> updateEhvSs(@ApiParam(value = "" ,required=true )  @Valid @RequestBody EhvSs body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<EhvSs>(HttpStatus.NOT_IMPLEMENTED);
    }

}
