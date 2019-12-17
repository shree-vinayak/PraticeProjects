package com.demo.spring.springSecurity.security;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.demo.spring.springSecurity.model.User;

public class JwtuserFactory {

	public static JwtUser create(User user) {

		return new JwtUser(user.getId(), user.getEmail(), user.getPassword(), user,
				maptoGrantedAuthorities(new ArrayList<String>(Arrays.asList("ROLE" + user.getRole()))),
				user.isEnabled());
	}

	private static List<GrantedAuthority> maptoGrantedAuthorities(List<String> authorities) {

		return authorities.stream().map(Authority -> new SimpleGrantedAuthority(Authority))
				.collect(Collectors.toList());
	}

}
