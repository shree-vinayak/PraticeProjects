package io.swagger.api;

import io.swagger.model.ErrorResponse;
import io.swagger.model.State;
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
public class StateApiController implements StateApi {

    private static final Logger log = LoggerFactory.getLogger(StateApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public StateApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<List<State>> getAllStates(@NotNull @Min(0)@ApiParam(value = "idCountry of the country to fetch states for.", required = true, allowableValues = "") @Valid @RequestParam(value = "idCountry", required = true) Integer idCountry,@ApiParam(value = "if provided, returns the states that match this name.") @Valid @RequestParam(value = "name", required = false) String name) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<List<State>>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<State> getState_(@Min(0)@ApiParam(value = "id of the state to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<State>(HttpStatus.NOT_IMPLEMENTED);
    }

}
