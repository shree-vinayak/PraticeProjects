package io.swagger.api;

import io.swagger.model.Circle;
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
public class CircleApiControllerIntegrationTest {

    @Autowired
    private CircleApi api;

    @Test
    public void addCircleTest() throws Exception {
        ResponseEntity<Circle> responseEntity = api.addCircle();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateCircleTest() throws Exception {
        ResponseEntity<Circle> responseEntity = api.updateCircle();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
