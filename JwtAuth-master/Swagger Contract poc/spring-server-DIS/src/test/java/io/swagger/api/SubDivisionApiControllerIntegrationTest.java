package io.swagger.api;

import io.swagger.model.ErrorResponse;
import io.swagger.model.SubDivision;

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
public class SubDivisionApiControllerIntegrationTest {

    @Autowired
    private SubDivisionApi api;

    @Test
    public void addSubDivisionTest() throws Exception {
        ResponseEntity<SubDivision> responseEntity = api.addSubDivision();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateSubDivisionTest() throws Exception {
        ResponseEntity<SubDivision> responseEntity = api.updateSubDivision();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
