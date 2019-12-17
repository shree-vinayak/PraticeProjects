package io.swagger.api;

import io.swagger.model.CountResponse;
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
        Integer idSubdivision = 56;
        Zone body = new Zone();
        ResponseEntity<Zone> responseEntity = api.addZone(idSubdivision, body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteZoneTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Zone> responseEntity = api.deleteZone(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllZoneTest() throws Exception {
        Integer idSubdivision = 56;
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Zone>> responseEntity = api.getAllZone(idSubdivision, name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getZoneTest() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Zone> responseEntity = api.getZone(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getZonesCountTest() throws Exception {
        Integer idSubdivision = 56;
        ResponseEntity<CountResponse> responseEntity = api.getZonesCount(idSubdivision);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateZoneTest() throws Exception {
        Zone body = new Zone();
        ResponseEntity<Zone> responseEntity = api.updateZone(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
