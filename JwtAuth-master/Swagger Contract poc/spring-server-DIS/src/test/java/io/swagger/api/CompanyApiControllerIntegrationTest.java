package io.swagger.api;

import io.swagger.model.Circle;
import io.swagger.model.Company;
import io.swagger.model.Division;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Region;
import io.swagger.model.SubDivision;
import io.swagger.model.Zone;

import java.util.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class CompanyApiControllerIntegrationTest {

    @Autowired
    private CompanyApi api;

    @Test
    public void addCompanyTest() throws Exception {
        ResponseEntity<Company> responseEntity = api.addCompany();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteCircleTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer id = 56;
        ResponseEntity<Circle> responseEntity = api.deleteCircle(idCompany, idRegion, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteCompanyTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Company> responseEntity = api.deleteCompany(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteDivisionTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer id = 56;
        ResponseEntity<Division> responseEntity = api.deleteDivision(idCompany, idRegion, idCircle, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteRegionTest() throws Exception {
        Integer idCompany = 56;
        Integer id = 56;
        ResponseEntity<Region> responseEntity = api.deleteRegion(idCompany, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteSubDivisionTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer idDivision = 56;
        Integer id = 56;
        ResponseEntity<SubDivision> responseEntity = api.deleteSubDivision(idCompany, idRegion, idCircle, idDivision, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteZoneTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer idDivision = 56;
        Integer idSubdivision = 56;
        Integer id = 56;
        ResponseEntity<Zone> responseEntity = api.deleteZone(idCompany, idRegion, idCircle, idDivision, idSubdivision, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllCircleTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        ResponseEntity<Circle> responseEntity = api.getAllCircle(idCompany, idRegion);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllCompanyTest() throws Exception {
        ResponseEntity<Company> responseEntity = api.getAllCompany();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllDivisionTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        ResponseEntity<Division> responseEntity = api.getAllDivision(idCompany, idRegion, idCircle);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllRegionTest() throws Exception {
        Integer idCompany = 56;
        ResponseEntity<Region> responseEntity = api.getAllRegion(idCompany);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllSubDivisionTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer idDivision = 56;
        ResponseEntity<SubDivision> responseEntity = api.getAllSubDivision(idCompany, idRegion, idCircle, idDivision);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllZoneTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer idDivision = 56;
        Integer idSubdivision = 56;
        ResponseEntity<Zone> responseEntity = api.getAllZone(idCompany, idRegion, idCircle, idDivision, idSubdivision);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCircleTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer id = 56;
        ResponseEntity<Circle> responseEntity = api.getCircle(idCompany, idRegion, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCompanyTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Company> responseEntity = api.getCompany(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getDivisionTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer id = 56;
        ResponseEntity<Division> responseEntity = api.getDivision(idCompany, idRegion, idCircle, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getRegionTest() throws Exception {
        Integer idCompany = 56;
        Integer id = 56;
        ResponseEntity<Region> responseEntity = api.getRegion(idCompany, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getSubDivisionTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer idDivision = 56;
        Integer id = 56;
        ResponseEntity<SubDivision> responseEntity = api.getSubDivision(idCompany, idRegion, idCircle, idDivision, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getZoneTest() throws Exception {
        Integer idCompany = 56;
        Integer idRegion = 56;
        Integer idCircle = 56;
        Integer idDivision = 56;
        Integer idSubdivision = 56;
        Integer id = 56;
        ResponseEntity<Zone> responseEntity = api.getZone(idCompany, idRegion, idCircle, idDivision, idSubdivision, id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateCompanyTest() throws Exception {
        ResponseEntity<Company> responseEntity = api.updateCompany();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
