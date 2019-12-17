package com.astute.auth.config;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuditAwareImpl implements AuditorAware<String> {

	@Override
	public Optional<String> getCurrentAuditor() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return null;
		}
		String name = authentication.getName();
		Optional<String> opt = Optional.of(name);

		// return ((UserDetails) authentication.getPrincipal()).getUser();
		return opt;

	}
}
