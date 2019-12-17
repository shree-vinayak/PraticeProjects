package com.test.springsecurity.configure;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		// TODO Auto-generated method stub
		// CREATE INMEMORY USERS
		auth.inMemoryAuthentication().withUser("ankit").password("ankit").roles("User").and().withUser("rajat")
				.password("rajat").roles("Admin");
	}

	/*
	 * SPRING SECURITY ENFORCES DEVELOPER DONT SAVE PASSWORD DIRECTLY WITHOUT
	 * ENCODING SO WHEN WE CONFIGURE SPRING SECURITY EXPLICITLY WE HAVE TO CONFIGURE
	 * PASSWORD ENCODING BEAN EXPLICITLY WHICH IS USED BY THE SPRING. OTHERWISE WE
	 * WILL GET AN EXCEPTION.
	 */
	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return NoOpPasswordEncoder.getInstance();
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// TODO Auto-generated method stub
		http.authorizeRequests()
		.antMatchers("/admin").hasRole("Admin")
		.antMatchers("/user").hasAnyRole("User","Admin")
//		.antMatchers("/","static/css","static/js").permitAll()
		.antMatchers("/").permitAll()
		.and().formLogin();
}
	}
	
	
	


