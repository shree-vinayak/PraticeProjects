package com.aartek.config;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.aartek.controller.LoggerController;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class LoggerInterceptor implements HandlerInterceptor {

	public static final Logger LOGGER = LoggerFactory.getLogger(LoggerController.class);

	// perform operations before sending the request to the controller.return true
	// as response to the client.
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		LOGGER.info("preHandle before Controller");
		response.getWriter().write("");
		System.out.println(HandlerInterceptor.super.preHandle(request, response, handler));

		Map<String, String> responseObj = new HashMap<>();
		responseObj.put("name", "aarti");
		response.setStatus(HttpStatus.OK.value());
		String json = new ObjectMapper().writeValueAsString(responseObj);
		response.getWriter().write(json);
		response.flushBuffer();

		return false; // HandlerInterceptor.super.preHandle(request, response, handler);
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// This is used to perform operations before sending the response to the client.
		HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// This is used to perform operations after completing the request and response.
		HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
	}

}
