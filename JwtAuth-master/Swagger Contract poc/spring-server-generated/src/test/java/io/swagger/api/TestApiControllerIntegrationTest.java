package io.swagger.api;

import io.swagger.model.User;

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
public class TestApiControllerIntegrationTest {

    @Autowired
    private TestApi api;

    @Test
    public void testAddUserPostTest() throws Exception {
        User body = new User();
        ResponseEntity<Void> responseEntity = api.testAddUserPost(body);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void testGetUserUserIdGetTest() throws Exception {
        Long userId = 789L;
        ResponseEntity<User> responseEntity = api.testGetUserUserIdGet(userId);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void testUserUserIdGetTest() throws Exception {
        Long userId = 789L;
        ResponseEntity<Void> responseEntity = api.testUserUserIdGet(userId);
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

    @Test
    public void testUsersGetTest() throws Exception {
        ResponseEntity<List<String>> responseEntity = api.testUsersGet();
        assertEquals(HttpStatus.NOT_IMPLEMENTED, responseEntity.getStatusCode());
    }

}
