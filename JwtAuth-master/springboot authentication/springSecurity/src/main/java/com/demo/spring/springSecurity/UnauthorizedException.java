package com.demo.spring.springSecurity;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.SpringSecurityMessageSource;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class UnauthorizedException  extends RuntimeException{
 /**
	 * 
	 */
	private static final long serialVersionUID = 3206275273199316503L;
protected static MessageSourceAccessor message =SpringSecurityMessageSource.getAccessor();
 
 
 
 public UnauthorizedException() {
	 super(message.getMessage("AbstractAcessDecisionManager.accessDenied","Access is denied"));
 }
 
 public UnauthorizedException(String message) {
	 super(message);
 }
}
