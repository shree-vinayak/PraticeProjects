package com.todos.result;

public class ResultWrapper<T extends Object> {

	private T result;

	private Result status;

	private String message;

	public void succeedCreated(T result) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = " created successfully.";
	}

	public void succeedUpdated(T result) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = " updated successfully.";
	}

	public void succeedDeleted(T result) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = " deleted successfully.";
	}

	public void succeedGet(T result) {
		this.result = result;
		this.status = Result.SUCCESS;
		this.message = " get successfully.";
	}

	public void fail(T result, String explanation) {
		this.setResult(result);
		this.setStatus(Result.EXCEPTION);
		this.setMessage(explanation);

	}
	
	public void error(T result, String explanation) {
		this.setResult(result);
		this.setStatus(Result.ERROR);
		this.setMessage(explanation);

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

}
