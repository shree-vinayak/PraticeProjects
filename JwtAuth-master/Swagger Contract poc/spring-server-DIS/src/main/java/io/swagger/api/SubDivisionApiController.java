package io.swagger.api;

import io.swagger.model.ErrorResponse;
import io.swagger.model.SubDivision;
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
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-27T11:55:04.724Z[GMT]")
@Controller
public class SubDivisionApiController implements SubDivisionApi {

    private static final Logger log = LoggerFactory.getLogger(SubDivisionApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public SubDivisionApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<SubDivision> addSubDivision() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<SubDivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<SubDivision> updateSubDivision() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<SubDivision>(HttpStatus.NOT_IMPLEMENTED);
    }

}
