package io.swagger.api;

import io.swagger.model.Circle;
import io.swagger.model.CountResponse;
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
        Integer idRegion = 56;
        Circle body = new Circle();
        ResponseEntity<Circle> responseEntity = api.addCircle(idRegion, body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteCircleTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Circle> responseEntity = api.deleteCircle(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllCircleTest() throws Exception {
        Integer idRegion = 56;
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Circle>> responseEntity = api.getAllCircle(idRegion, name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCircleTest() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Circle> responseEntity = api.getCircle(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCirclesCountTest() throws Exception {
        Integer idRegion = 56;
        String name = "name_example";
        ResponseEntity<CountResponse> responseEntity = api.getCirclesCount(idRegion, name);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateCircleTest() throws Exception {
        Circle body = new Circle();
        ResponseEntity<Circle> responseEntity = api.updateCircle(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
