package com.subscription.service.result;

public class ResultWrapper<T extends Object> {

	
	private T obj;

	private Result status;

	private String message;

	private String token;

	public void succeed(T obj) {
		this.obj = obj;
		this.status = Result.SUCCESS;
		this.message = null;
	}

	public void succeedCreated(T obj, String name) {
		this.obj = obj;
		this.status = Result.SUCCESS;
		this.message = name + " created successfully.";
	}

	public void succeedUpdated(T obj, String name) {
		this.obj = obj;
		this.status = Result.SUCCESS;
		this.message = name + " updated successfully.";
	}

	public void succeedDeleted(T obj, String name) {
		this.obj = obj;
		this.status = Result.SUCCESS;
		this.message = name + " deleted successfully.";
	}

	/**
	 * Convenience method for populating "failed" state
	 */
	public void fail(T obj, String explanation, Throwable ex) {
		this.setObj(obj);
		this.setStatus(ex == null ? Result.FAIL : Result.EXCEPTION);

	}

	public T getObj() {
		return obj;
	}

	public void setObj(T obj) {
		this.obj = obj;
	}


	public Result getStatus() {
		return status;
	}

	public void setStatus(Result status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}
