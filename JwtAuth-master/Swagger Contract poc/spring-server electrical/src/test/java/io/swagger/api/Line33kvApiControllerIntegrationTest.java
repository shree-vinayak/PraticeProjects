package io.swagger.api;

import io.swagger.model.ErrorResponse;
import io.swagger.model.Line33kv;

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
public class Line33kvApiControllerIntegrationTest {

    @Autowired
    private Line33kvApi api;

    @Test
    public void addLine33kvTest() throws Exception {
        Line33kv body = new Line33kv();
        ResponseEntity<Line33kv> responseEntity = api.addLine33kv(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void disableLine33kvTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Boolean> responseEntity = api.disableLine33kv(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllLine33kvTest() throws Exception {
        ResponseEntity<List<Line33kv>> responseEntity = api.getAllLine33kv();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateLine33kvTest() throws Exception {
        Line33kv body = new Line33kv();
        ResponseEntity<Line33kv> responseEntity = api.updateLine33kv(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
