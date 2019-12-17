package com.test.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.HashSet;
import java.util.Set;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.google.gson.Gson;
import com.test.model.Child;
import com.test.model.User;
import com.test.service.UserService;

@RunWith(SpringRunner.class)
@WebMvcTest(value = UserController.class)
public class UserControllerTest {

	@MockBean
	UserService userService;

	@Autowired
	MockMvc mockMvc;

	@Test
	public void testGetUser() throws Exception {
		User user = getUser();

		Mockito.when(userService.getUser(user.getId())).thenReturn(user);
		mockMvc.perform(get("/getUser/" + user.getId())).andExpect(status().isOk());

	}

	@Test
	public void testCreateUser() throws Exception {
		User user = getUser();

		Mockito.when(userService.saveUser(user)).thenReturn(user);
		mockMvc.perform(post("/save").contentType(MediaType.APPLICATION_JSON).content(new Gson().toJson(user)))
				.andExpect(status().isCreated());

	}

	private User getUser() {

		Child child1 = new Child();
		child1.setChildName("om");
		child1.setId(1);

		Child child2 = new Child();
		child2.setChildName("situn");
		child2.setId(2);

		Set<Child> set = new HashSet<Child>();
		set.add(child1);
		set.add(child2);

		User user = new User();
		user.setId(1);
		user.setName("harsh");
		user.setSalary(5644);
		user.setChild(set);
		return user;

	}

}
