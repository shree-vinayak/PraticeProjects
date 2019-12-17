package io.swagger.api;

import io.swagger.model.Country;
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
public class CountryApiControllerIntegrationTest {

    @Autowired
    private CountryApi api;

    @Test
    public void getAllCountriesTest() throws Exception {
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Country>> responseEntity = api.getAllCountries(name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCountry_Test() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Country> responseEntity = api.getCountry_(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
