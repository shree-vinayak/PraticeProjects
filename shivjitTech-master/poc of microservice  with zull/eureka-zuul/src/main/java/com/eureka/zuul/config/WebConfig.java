package com.eureka.zuul.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	 @Override
	    public void addCorsMappings(CorsRegistry corsRegistry) {
	        corsRegistry.addMapping( "/**" )
	                .allowedOrigins( "*" )
	                .allowedMethods( "GET", "POST", "DELETE","PUT" )
	                .allowedHeaders( "*" )
	                .allowCredentials( true )
//	                .exposedHeaders( "*" )
	                .maxAge( 3600 );
	    }
}
