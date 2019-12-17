package io.swagger.api;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Subdivision;

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
public class SubdivisionApiControllerIntegrationTest {

    @Autowired
    private SubdivisionApi api;

    @Test
    public void addSubDivisionTest() throws Exception {
        Integer idDivision = 56;
        Subdivision body = new Subdivision();
        ResponseEntity<Subdivision> responseEntity = api.addSubDivision(idDivision, body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteSubDivisionTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Subdivision> responseEntity = api.deleteSubDivision(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllSubDivisionTest() throws Exception {
        Integer idDivision = 56;
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Subdivision>> responseEntity = api.getAllSubDivision(idDivision, name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getSubDivisionTest() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Subdivision> responseEntity = api.getSubDivision(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getSubdivisionsCountTest() throws Exception {
        Integer idDivision = 56;
        ResponseEntity<CountResponse> responseEntity = api.getSubdivisionsCount(idDivision);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateSubDivisionTest() throws Exception {
        Subdivision body = new Subdivision();
        ResponseEntity<Subdivision> responseEntity = api.updateSubDivision(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
