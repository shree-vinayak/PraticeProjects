package com.astute.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.astute.auth.config.JwtTokenUtil;
import com.astute.auth.dto.UserDto;
import com.astute.auth.model.UserInf;
import com.astute.auth.service.UserService;
import com.astute.results.ResultWrapper;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private UserService userService;

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<ResultWrapper<UserInf>> register(@RequestBody UserDto loginUser)
			throws AuthenticationException {
		final Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginUser.getUsername(), loginUser.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		final String token = jwtTokenUtil.generateToken(authentication);
		ResultWrapper<UserInf> result = null;
		if (token != null) {
			String username = authentication.getName();
			result = userService.findOne(username, token);
		}
		return new ResponseEntity<ResultWrapper<UserInf>>(result, HttpStatus.OK);// ResponseEntity.ok(new
																					// AuthToken(token));
	}

	// To validata the token and return true if the token is validate
	@RequestMapping(value = "/validate", method = RequestMethod.GET)
	public ResponseEntity<Boolean> validate() throws AuthenticationException {
//		HttpHeaders responseHeaders = new HttpHeaders();
//		responseHeaders.set("value", "true");
//		return ResponseEntity.ok().headers(responseHeaders).body("");
	  return new ResponseEntity<Boolean>(true,HttpStatus.OK);
	}
}
