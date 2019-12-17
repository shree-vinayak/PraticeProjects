package io.swagger.api;

import io.swagger.model.ErrorResponse;
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
public class ZoneApiControllerIntegrationTest {

    @Autowired
    private ZoneApi api;

    @Test
    public void addZoneTest() throws Exception {
        ResponseEntity<Zone> responseEntity = api.addZone();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateZoneTest() throws Exception {
        ResponseEntity<Zone> responseEntity = api.updateZone();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
