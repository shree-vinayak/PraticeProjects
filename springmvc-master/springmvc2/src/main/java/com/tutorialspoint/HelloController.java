package com.tutorialspoint;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/hello")
public class HelloController {

	@RequestMapping(value="/king",method = RequestMethod.GET)
	public String printHello(ModelMap model) {
		model.addAttribute("message", "Hello Spring mvc framework");
		return "hello";
	}
	@RequestMapping( value="/rajat" ,method = RequestMethod.POST)
	public String print(ModelMap model, HttpServletRequest request) {
		System.out.println(request.getParameter("name"));
		System.out.println(request.getParameter("email"));
		
		model.addAttribute("message", "Hello Spring mvc framework1");
		return "hello1";
	}
}
