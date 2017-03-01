package com.jdo;

import javax.jdo.annotations.PersistenceCapable;

@PersistenceCapable
public class EmailDetails {
    
	private String fromAddress;
	private String toAddress;
	private Long frequent;
	private Long subfreq;	
	private String queryId;
	private String subject;
	public String getFromAddress() {
		return fromAddress;
	}
	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}
	public String getToAddress() {
		return toAddress;
	}
	public void setToAddress(String toAddress) {
		this.toAddress = toAddress;
	}
	public Long getfrequent() {
		return frequent;
	}
	public void setfrequent(Long frequent) {
		this.frequent = frequent;
	}
	
	public String getQueryId() {
		return queryId;
	}
	public void setQueryId(String queryId) {
		this.queryId = queryId;
	}
	public Long getSubfreq() {
		return subfreq;
	}
	public void setSubfreq(Long subfreq) {
		this.subfreq = subfreq;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
}
