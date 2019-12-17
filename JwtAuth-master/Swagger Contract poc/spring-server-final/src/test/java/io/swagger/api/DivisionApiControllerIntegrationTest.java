package io.swagger.api;

import io.swagger.model.CountResponse;
import io.swagger.model.Division;
import io.swagger.model.ErrorResponse;

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
public class DivisionApiControllerIntegrationTest {

    @Autowired
    private DivisionApi api;

    @Test
    public void addDivisionTest() throws Exception {
        Integer idCircle = 56;
        Division body = new Division();
        ResponseEntity<Division> responseEntity = api.addDivision(idCircle, body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteDivisionTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Division> responseEntity = api.deleteDivision(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllDivisionTest() throws Exception {
        Integer idCircle = 56;
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Division>> responseEntity = api.getAllDivision(idCircle, name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getDivisionTest() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Division> responseEntity = api.getDivision(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getDivisionsCountTest() throws Exception {
        Integer idCircle = 56;
        ResponseEntity<CountResponse> responseEntity = api.getDivisionsCount(idCircle);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateDivisionTest() throws Exception {
        Division body = new Division();
        ResponseEntity<Division> responseEntity = api.updateDivision(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
