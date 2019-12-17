package com.eureka.zuul.serviceImpl;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.eureka.zuul.model.UserInf;
import com.eureka.zuul.repository.UserDao;
import com.eureka.zuul.results.Result;
import com.eureka.zuul.results.ResultWrapper;
import com.eureka.zuul.service.UserService;

@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService {

	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	private UserDao userDao;

	@Autowired
	private BCryptPasswordEncoder bcryptEncoder;

	@Autowired
	private JavaMailSender sender;

	public ResultWrapper<UserInf> save(UserInf user) {
		LOGGER.info("User made request for subscribe package : ",user.getPkg().getPkgName());
		ResultWrapper<UserInf> result = new ResultWrapper<>();
		try {
			UserInf existUser = userDao.findByUsername(user.getUsername()); 
			if (Objects.nonNull(existUser)) {
				result.setStatus(Result.EXCEPTION);
				result.setMessage(user.getUsername() + " user already exist");
				LOGGER.warn(user.getUsername() + " user already exist");
				return result;
			}
			user.setPassword(bcryptEncoder.encode(user.getPassword()));
			user.setCreatedDate(LocalDateTime.now());
			user = userDao.save(user);
			result.succeedCreated(user, user.getName());
			
			String userId=user.getUserId();
			String email_text = new String(Files.readAllBytes(Paths.get(
					 "src/main/resources/email.txt")));
			//String activation_link="http://www.w3docs.com/";
			String activation_link="http://localhost:8762/subscription/activate/"+userId;
			String footer=new String(Files.readAllBytes(Paths.get(
					 "src/main/resources/footer.txt")));
			sendMail("ankitrajpootsv.ar@gmail.com", "Email Subject by poc", email_text+activation_link
					+footer);
			
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(e.toString());
			LOGGER.error("Exception : ", e);
		}
		return result;
	}

	@Override
	public List<UserInf> findAll() {
		List<UserInf> list = userDao.findAll();
		return list;
	}

	/*
	 * @Override public ResultWrapper<UserInf> findById(String id) {
	 * LOGGER.info("Inside findById method"); ResultWrapper<UserInf> result = new
	 * ResultWrapper<>(); UserInf userInf = userDao.findById(id).get(); if
	 * (Objects.isNull(userInf)) { result.setStatus(Result.EXCEPTION);
	 * 
	 * result.setMessage("User not registered with id : " + id);
	 * LOGGER.error("User not registered with id : ", id); return result; }
	 * result.succeedCreated(userInf, userInf.getName()); return result; }
	 */
	
	@Override
	public UserInf findById(String id) {
		UserInf userInf = userDao.findById(id).get();
		LOGGER.info(userInf.getName(), " user made request to activate his package");
		return userInf;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		LOGGER.info("Inside loadUserByUsername method");
		UserInf user = userDao.findByUsername(username);
		if (user == null) {
			throw new UsernameNotFoundException("Invalid username or password");
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				getAuthority(user));
	}

	private Set<SimpleGrantedAuthority> getAuthority(UserInf user) {
		LOGGER.info("Inside getAuthority method");
		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
		return authorities;
	}

	// To get User object from the database and form ResultWrapper Object with token
	@Override
	public ResultWrapper<UserInf> findOne(String username, String token) {
		LOGGER.info("Inside findOne method");
		ResultWrapper<UserInf> result = new ResultWrapper<>();
		try {
			UserInf user = userDao.findByUsername(username);
			result.setobj(user);
			result.setToken(token);
			result.setStatus(Result.SUCCESS);
			result.setMessage("Logged In Successfully");
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
//			result.setMessage(e.toString());
		}
		return result;
	}

	public String sendMail(String reciver, String subject, String text) {
		MimeMessage message = sender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);

		try {
			helper.setTo(reciver);
			message.setContent(text, "text/html");
			helper.setSubject(subject);
		} catch (MessagingException e) {
			e.printStackTrace();
			return "Error while sending mail ..";
		}
		sender.send(message);
		return "Mail Sent Success!";
	}

}
