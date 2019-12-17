package io.swagger.api;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Line33kv;
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
@javax.annotation.Generated(value = "io.swagger.codegen.v3.generators.java.SpringCodegen", date = "2019-05-30T10:52:13.430Z[GMT]")
@Controller
public class Line33kvApiController implements Line33kvApi {

    private static final Logger log = LoggerFactory.getLogger(Line33kvApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public Line33kvApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<Line33kv> addLine33kv(@ApiParam(value = "" ,required=true )  @Valid @RequestBody Line33kv body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Line33kv>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Boolean> disableLine33kv(@Min(0)@ApiParam(value = "id of the Line33kv to set isActive false.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Boolean>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<List<Line33kv>> getAllLine33kv() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<Line33kv>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Line33kv> updateLine33kv(@ApiParam(value = "" ,required=true )  @Valid @RequestBody Line33kv body) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Line33kv>(HttpStatus.NOT_IMPLEMENTED);
    }

}
