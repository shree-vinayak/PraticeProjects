package io.javabrains.ratingdataservice.controller;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.javabrains.ratingdataservice.model.Rating;
import io.javabrains.ratingdataservice.model.UserRating;

@RestController
@RequestMapping("/ratingsdata")
public class RatingResource {

	@RequestMapping("/{movieId}")
	public Rating getRating(@PathVariable("movieId") String movieId) {
		return new Rating(movieId, 4);
	}

	@RequestMapping("users/{userId}")
	public UserRating getUserRating(@PathVariable("userId") String userId, HttpServletRequest req,
			HttpServletResponse res) {

		String heder = req.getHeader("Authorization");
		System.out.println("heder i s " + heder);

		List<Rating> ratings = Arrays.asList(new Rating("12345", 41), new Rating("56786", 31));

		UserRating userRating = new UserRating();
		userRating.setUserRating(ratings);
		return userRating;
	}

}
