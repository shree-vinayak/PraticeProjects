package io.swagger.api;

import io.swagger.model.CountResponse;
import io.swagger.model.ErrorResponse;
import io.swagger.model.Region;

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
public class RegionApiControllerIntegrationTest {

    @Autowired
    private RegionApi api;

    @Test
    public void addRegionTest() throws Exception {
        Integer idCompany = 56;
        Region body = new Region();
        ResponseEntity<Region> responseEntity = api.addRegion(idCompany, body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteRegionTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Region> responseEntity = api.deleteRegion(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllRegionTest() throws Exception {
        Integer idCompany = 56;
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Region>> responseEntity = api.getAllRegion(idCompany, name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getRegionTest() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Region> responseEntity = api.getRegion(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getRegionsCountTest() throws Exception {
        Integer idCompany = 56;
        ResponseEntity<CountResponse> responseEntity = api.getRegionsCount(idCompany);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateRegionTest() throws Exception {
        Region body = new Region();
        ResponseEntity<Region> responseEntity = api.updateRegion(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
