package io.swagger.api;

import io.swagger.model.Company;
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
public class CompanyApiControllerIntegrationTest {

    @Autowired
    private CompanyApi api;

    @Test
    public void addCompanyTest() throws Exception {
        Integer idState = 56;
        Company body = new Company();
        ResponseEntity<Company> responseEntity = api.addCompany(idState, body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void deleteCompanyTest() throws Exception {
        Integer id = 56;
        ResponseEntity<Company> responseEntity = api.deleteCompany(id);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getAllCompanyTest() throws Exception {
        Integer idState = 56;
        String name = "name_example";
        Boolean populate = true;
        ResponseEntity<List<Company>> responseEntity = api.getAllCompany(idState, name, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCompaniesCountTest() throws Exception {
        ResponseEntity<CountResponse> responseEntity = api.getCompaniesCount();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void getCompanyTest() throws Exception {
        Integer id = 56;
        Boolean populate = true;
        ResponseEntity<Company> responseEntity = api.getCompany(id, populate);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void updateCompanyTest() throws Exception {
        Company body = new Company();
        ResponseEntity<Company> responseEntity = api.updateCompany(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
