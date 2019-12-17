package io.swagger.api;

import io.swagger.model.EhvSs;
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
public class EhvSsApiControllerIntegrationTest {

    @Autowired
    private EhvSsApi api;

    @Test
    public void addEhvSsTest() throws Exception {
        EhvSs body = new EhvSs();
        ResponseEntity<EhvSs> responseEntity = api.addEhvSs(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void disableEhvSsTest() throws Exception {
        Integer id = 56;
        ResponseEntity<List<Boolean>> responseEntity = api.disableEhvSs(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllEhvSsTest() throws Exception {
        ResponseEntity<List<EhvSs>> responseEntity = api.getAllEhvSs();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateEhvSsTest() throws Exception {
        EhvSs body = new EhvSs();
        ResponseEntity<EhvSs> responseEntity = api.updateEhvSs(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
