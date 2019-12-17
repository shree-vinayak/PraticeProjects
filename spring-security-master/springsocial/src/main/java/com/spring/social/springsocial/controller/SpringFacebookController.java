package com.spring.social.springsocial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.facebook.api.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.view.RedirectView;

import com.spring.social.springsocial.model.UserInfo;
import com.spring.social.springsocial.service.FacebookService;

@Controller
public class SpringFacebookController {

	@Autowired
	private FacebookService facebookService;

	@GetMapping(value = "/facebooklogin")
	public RedirectView facebooklogin() {
		RedirectView redirectView = new RedirectView();
		String url = facebookService.facebooklogin();
		System.out.println("facebook url" + url);
		redirectView.setUrl(url);
		return redirectView;
	}

	@GetMapping(value = "/facebook")
	public String facebook(@RequestParam("code") String code) {
		String accessToken = facebookService.getFacebookAccessToken(code);

		return "redirect:/facebookprofiledata/" + accessToken;
	}

	@GetMapping(value = "/facebookprofiledata/{accessToken:.+}")
	public String facebookprofiledata(@PathVariable String accessToken, Model model) {
		System.out.println("accessToken" + accessToken);
		User user = facebookService.getFacebookUserProfile(accessToken);
		System.out.println("user" + user.toString());
//		UserInfo userInfo = new UserInfo(user.getFirstName(), user.getLastName(), user.getCover().getSource());

		model.addAttribute("user", null);

		return "view/userprofile";
	}

}
