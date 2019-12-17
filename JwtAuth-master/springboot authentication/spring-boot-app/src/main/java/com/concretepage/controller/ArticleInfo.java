package com.concretepage.controller;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class ArticleInfo {
	@JsonInclude(Include.NON_NULL)
    private long articleId;
	@JsonInclude(Include.NON_NULL)
    private String title;
	@JsonInclude(Include.NON_NULL)
    private String category;
	public long getArticleId() {
		return articleId;
	}
	public void setArticleId(long articleId) {
		this.articleId = articleId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	} 
}