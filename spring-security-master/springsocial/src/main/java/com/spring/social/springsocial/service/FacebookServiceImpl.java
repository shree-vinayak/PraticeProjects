package com.spring.social.springsocial.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.User;
import org.springframework.social.facebook.api.impl.FacebookTemplate;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;
import org.springframework.social.oauth2.OAuth2Parameters;
import org.springframework.stereotype.Service;

@Service
public class FacebookServiceImpl implements FacebookService {

	@Value("${spring.social.facebook.app-id}")
	private String facebookId;

	@Value("${spring.social.facebook.app-secret}")
	private String facebookSecret;

	private FacebookConnectionFactory CreateFacebookConnection() {
		return new FacebookConnectionFactory(facebookId, facebookSecret);
	}

	@Override
	public String facebooklogin() {
		OAuth2Parameters auth2Parameters = new OAuth2Parameters();
		auth2Parameters.setRedirectUri("http://localhost:3000/facebook");
		auth2Parameters.setScope("public_profile,email");
		return CreateFacebookConnection().getOAuthOperations().buildAuthenticateUrl(auth2Parameters);
	}

	@Override
	public String getFacebookAccessToken(String code) {
		// TODO Auto-generated method stub
		return CreateFacebookConnection().getOAuthOperations()
				.exchangeForAccess(code, "http://localhost:3000/facebook", null).getAccessToken();
	}

	@Override
	public User getFacebookUserProfile(String accessToken) {

		Facebook facebook = new FacebookTemplate(accessToken);

		String[] fields = { "id", "first_name", "last_name", "email" };
		System.out.println(facebook.fetchObject("me", User.class, fields));
		return null;
	}

}
