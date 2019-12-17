package io.swagger.api;

import io.swagger.model.Circle;
import io.swagger.model.Company;
import io.swagger.model.Division;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Region;
import io.swagger.model.SubDivision;
import io.swagger.model.Zone;
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
public class CompanyApiController implements CompanyApi {

    private static final Logger log = LoggerFactory.getLogger(CompanyApiController.class);

    private final ObjectMapper objectMapper;

    private final HttpServletRequest request;

    @org.springframework.beans.factory.annotation.Autowired
    public CompanyApiController(ObjectMapper objectMapper, HttpServletRequest request) {
        this.objectMapper = objectMapper;
        this.request = request;
    }

    public ResponseEntity<Company> addCompany() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Circle> deleteCircle(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "id of the circle to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> deleteCompany(@Min(0)@ApiParam(value = "id of the company to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Division> deleteDivision(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "id of the division to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Division>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Region> deleteRegion(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "id of the region to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<SubDivision> deleteSubDivision(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "idDivision of the division to fetch.",required=true, allowableValues = "") @PathVariable("idDivision") Integer idDivision,@Min(0)@ApiParam(value = "id of the subDivision to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<SubDivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Zone> deleteZone(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "idDivision of the division to fetch.",required=true, allowableValues = "") @PathVariable("idDivision") Integer idDivision,@Min(0)@ApiParam(value = "idSubdivision of the subdivision to fetch.",required=true, allowableValues = "") @PathVariable("idSubdivision") Integer idSubdivision,@Min(0)@ApiParam(value = "id of the zone to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Zone>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Circle> getAllCircle(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> getAllCompany() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Division> getAllDivision(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Division>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Region> getAllRegion(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<SubDivision> getAllSubDivision(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "idDivision of the division to fetch.",required=true, allowableValues = "") @PathVariable("idDivision") Integer idDivision) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<SubDivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Zone> getAllZone(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "idDivision of the division to fetch.",required=true, allowableValues = "") @PathVariable("idDivision") Integer idDivision,@Min(0)@ApiParam(value = "idSubdivision of the subdivision to fetch.",required=true, allowableValues = "") @PathVariable("idSubdivision") Integer idSubdivision) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Zone>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Circle> getCircle(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "id of the circle to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Circle>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> getCompany(@Min(0)@ApiParam(value = "id of the company to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Division> getDivision(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "id of the division to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Division>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Region> getRegion(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "id of the region to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Region>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<SubDivision> getSubDivision(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "idDivision of the division to fetch.",required=true, allowableValues = "") @PathVariable("idDivision") Integer idDivision,@Min(0)@ApiParam(value = "id of the subSubDivision to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<SubDivision>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Zone> getZone(@Min(0)@ApiParam(value = "idCompany of the company to fetch.",required=true, allowableValues = "") @PathVariable("idCompany") Integer idCompany,@Min(0)@ApiParam(value = "idRegion of the region to fetch.",required=true, allowableValues = "") @PathVariable("idRegion") Integer idRegion,@Min(0)@ApiParam(value = "idCircle of the circle to fetch.",required=true, allowableValues = "") @PathVariable("idCircle") Integer idCircle,@Min(0)@ApiParam(value = "idDivision of the division to fetch.",required=true, allowableValues = "") @PathVariable("idDivision") Integer idDivision,@Min(0)@ApiParam(value = "idSubdivision of the subdivision to fetch.",required=true, allowableValues = "") @PathVariable("idSubdivision") Integer idSubdivision,@Min(0)@ApiParam(value = "id of the zone to fetch.",required=true, allowableValues = "") @PathVariable("id") Integer id) {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Zone>(HttpStatus.NOT_IMPLEMENTED);
    }

    public ResponseEntity<Company> updateCompany() {
        String accept = request.getHeader("Accept");
        return new ResponseEntity<Company>(HttpStatus.NOT_IMPLEMENTED);
    }

}
