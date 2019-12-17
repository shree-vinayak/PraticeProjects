package io.swagger.api;

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
        ResponseEntity<Division> responseEntity = api.addDivision();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateDivisionTest() throws Exception {
        ResponseEntity<Division> responseEntity = api.updateDivision();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
