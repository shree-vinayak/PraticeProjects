package com.javatpoint;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {
	
	@RequestMapping("/hello")
	public String redirect(){
		System.out.println("inside redirect method");
		System.out.println("inside redirect method");
		return "viewpage";
	}
	
	@RequestMapping("/helloagain")
	public String display() {
		System.out.println("inside display method");
		return "final";
	}

}
