package io.swagger.api;

import io.swagger.model.ErrorResponse;
import io.swagger.model.State;

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
public class StateApiControllerIntegrationTest {

    @Autowired
    private StateApi api;

    @Test
    public void getAllStatesTest() throws Exception {
        Integer idCountry = 56;
        String name = "name_example";
        ResponseEntity<List<State>> responseEntity = api.getAllStates(idCountry, name);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getState_Test() throws Exception {
        Integer id = 56;
        ResponseEntity<State> responseEntity = api.getState_(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
