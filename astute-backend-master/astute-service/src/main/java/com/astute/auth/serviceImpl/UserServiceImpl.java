package com.astute.auth.serviceImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.astute.auth.dto.UserDto;
import com.astute.auth.model.UserInf;
import com.astute.auth.repository.UserDao;
import com.astute.auth.service.UserService;
import com.astute.results.Result;
import com.astute.results.ResultWrapper;
import com.astute.util.UserUtil;

@Service(value = "userService")
public class UserServiceImpl implements UserDetailsService, UserService {

	@Autowired
	private UserDao userDao;

	@Autowired
	private BCryptPasswordEncoder bcryptEncoder;

	@Autowired
	private UserUtil userUtil;

	public ResultWrapper<UserInf> save(UserDto userDto) {
		ResultWrapper<UserInf> result = new ResultWrapper<>();
		try {
			UserInf user = userUtil.copyRequestObjectForUser(userDto);
			user = userDao.save(user);
			result.succeedCreated(user, user.getName());
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
			result.setMessage(e.toString());
		}
		return result;
	}

	@Override
	public List<UserInf> findAll() {
		List<UserInf> list = userDao.findAll();
		return list;
	}

//	@Override
//	public void delete(In id) {
//		userDao.deleteById(id);
//		;
//	}

	@Override
	public UserInf findById(Integer id) {
		return userDao.findById(id).get();
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		UserInf user = userDao.findByUsername(username);
		if (user == null) {
			throw new UsernameNotFoundException("Invalid username or password");
		}
		return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
				getAuthority(user));
	}

//	private List<SimpleGrantedAuthority> getAuthority() {
//		return Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN"));
//	}

	private Set<SimpleGrantedAuthority> getAuthority(UserInf user) {
		Set<SimpleGrantedAuthority> authorities = new HashSet<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
		return authorities;
	}

	// To get User object from the database and form ResultWrapper Object with token
	@Override
	public ResultWrapper<UserInf> findOne(String username, String token) {

		ResultWrapper<UserInf> result = new ResultWrapper<>();
		try {
			UserInf user = userDao.findByUsername(username);
			result.setResult(user);
			result.setToken(token);
			result.setStatus(Result.SUCCESS);
			result.setMessage("Logged In Successfully");
		} catch (Exception e) {
			result.setStatus(Result.EXCEPTION);
//			result.setMessage(e.toString());
		}
		return result;
	}

}
