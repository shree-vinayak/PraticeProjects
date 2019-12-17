package com.todos.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "todos")
public class Todos {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "todoId")
	private Integer todoId;

	@Column(name = "title")
	private String title;

	@Column(name = "description")
	private String description;

	@Column(name = "time")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd hh:mm:ss a")
	private LocalDateTime timeOfTheEvent;

	public Integer getTodoId() {
		return todoId;
	}

	public void setTodoId(Integer todoId) {
		this.todoId = todoId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDateTime getTimeOfTheEvent() {
		return timeOfTheEvent;
	}

	public void setTimeOfTheEvent(LocalDateTime timeOfTheEvent) {
		this.timeOfTheEvent = timeOfTheEvent;
	}

}
