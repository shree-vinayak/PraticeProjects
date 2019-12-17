package io.javabrains.moviecatalogservice.contoller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import io.javabrains.moviecatalogservice.model.CatalogItem;
import io.javabrains.moviecatalogservice.model.Movie;
import io.javabrains.moviecatalogservice.model.UserRating;

@RestController
@RequestMapping("/catalog")
public class MovieCatalogResources {

	@Autowired
	private RestTemplate rest;

	@Autowired
	private WebClient.Builder webClientBuilder;

	@RequestMapping("/{userId}")
	public List<CatalogItem> getCatalog(@PathVariable("userId") String userId) {

//		List<Rating> ratings = Arrays.asList(new Rating("1234", 4), new Rating("5678", 3));
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer sdajasdasfasfasfa");

		HttpEntity<String> entity = new HttpEntity<String>(headers);

		
		rest.exchange("http://rating-data-service/ratingsdata/users/"+ userId, HttpMethod.GET, entity,  UserRating.class);
		UserRating ratings = rest.getForObject("http://rating-data-service/ratingsdata/users/" + userId, UserRating.class,headers);

		return ratings.getUserRating().stream().map(rating -> {
			Movie movie = rest.getForObject("http://movie-info-service/movies/" + rating.getMovieId(), Movie.class);

//			Movie movie = webClientBuilder.build().get().uri("http://localhost:8082/movies/" + rating.getMovieId())
//					.retrieve().bodyToMono(Movie.class).block();

			return new CatalogItem(movie.getName(), "Test1", rating.getRating());
		}).collect(Collectors.toList());

//		return Collections.singletonList(new CatalogItem("transformer", "test", 4));
	}

}
