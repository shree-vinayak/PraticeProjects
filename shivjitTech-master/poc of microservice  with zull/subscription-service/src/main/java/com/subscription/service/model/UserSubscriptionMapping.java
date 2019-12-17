package com.subscription.service.model;

public class UserSubscriptionMapping {
	
	private Long userSubscriptionMappingId;

	
	private Long userId;

	
	private Long subscriptionId;

	public Long getUserSubscriptionMappingId() {
		return userSubscriptionMappingId;
	}

	public void setUserSubscriptionMappingId(Long userSubscriptionMappingId) {
		this.userSubscriptionMappingId = userSubscriptionMappingId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getSubscriptionId() {
		return subscriptionId;
	}

	public void setSubscriptionId(Long subscriptionId) {
		this.subscriptionId = subscriptionId;
	}

}
