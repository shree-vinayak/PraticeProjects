package com.astute.results;

public class ResultWrapper<T extends Object> {

	private T result;

	private Result status;

	private String message;

	private String token;

	public void succeed(T result) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = null;
	}

	public void succeedCreated(T result, String name) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = name + " created successfully.";
	}

	public void succeedUpdated(T result, String name) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = name + " updated successfully.";
	}

	public void succeedDeleted(T result, String name) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = name + " deleted successfully.";
	}

	/**
	 * Convenience method for populating "failed" state
	 */
	public void fail(T result, String explanation, Throwable ex) {
		this.setResult(result);
		this.setStatus(ex == null ? Result.FAIL : Result.EXCEPTION);

	}

	public T getResult() {
		return result;
	}

	public void setResult(T result) {
		this.result = result;
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
