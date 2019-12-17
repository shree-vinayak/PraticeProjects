package com.astute.util;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.astute.auth.dto.UserDto;
import com.astute.auth.model.UserInf;
import com.astute.auth.model.UserRoleMapping;
import com.astute.discom.models.AddressDto;
import com.astute.discom.models.StateDto;

@Component
public class UserUtil {

	@Autowired
	private BCryptPasswordEncoder bcryptEncoder;

	public UserInf copyRequestObjectForUser(UserDto userDto) {
		UserInf user = new UserInf();
		if (userDto.getUserId() != null)
			user.setUserId(userDto.getUserId());

		if (userDto.getName() != null)
			user.setName(userDto.getName());

		if (userDto.getUsername() != null)
			user.setUsername(userDto.getUsername());

		if (userDto.getPassword() != null)
			user.setPassword(bcryptEncoder.encode(userDto.getPassword()));

		if (userDto.getAddress() != null) {
			AddressDto address = new AddressDto();
			if (userDto.getAddress().getIdAddress() != null)
				address.setIdAddress(userDto.getAddress().getIdAddress());
			if (userDto.getAddress().getAddress() != null)
				address.setAddress(userDto.getAddress().getAddress());
			user.setAddress(address);
		}

		if (userDto.getState() != null) {
			StateDto state = new StateDto();
			if (userDto.getState().getStateId() != null)
				state.setStateId(userDto.getState().getStateId());
			if (userDto.getState().getStateName() != null)
				state.setStateName(userDto.getState().getStateName());
			user.setState(state);
		}

		if (userDto.getMobile() != null)
			user.setMobile(userDto.getMobile());

		if (userDto.getRole() != null)
			user.setRole(userDto.getRole());
//
//		if (userDto.getId() != null) {
//			List<UserRoleMapping> userRoleMappingList = new ArrayList<UserRoleMapping>();
//			UserRoleMapping userRoleMapping = new UserRoleMapping();
//			userRoleMapping.setId(userDto.getId());
//			userRoleMapping.setRole(userDto.getRole());
//			userRoleMapping.setUsername(userDto.getUsername());
//			userRoleMapping.setStartDate(new Date(System.currentTimeMillis()));
//			userRoleMapping.setEndDate(new Date(System.currentTimeMillis()));
//			userRoleMapping.setIsActive(true);
//			userRoleMappingList.add(userRoleMapping);
//			user.setUserRoleMapping(userRoleMappingList);
//		}
		user.setStartDate(new Date(System.currentTimeMillis()));
		user.setEndDate(new Date(System.currentTimeMillis()));
		user.setIsActive(true);

		return user;
	}

}
