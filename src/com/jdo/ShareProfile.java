package com.jdo;

import javax.jdo.annotations.PersistenceCapable;


@PersistenceCapable
public class ShareProfile {

	String toAddress;
	String fromAddress;
	String profile;
	public String getToAddress() {
		return toAddress;
	}
	public void setToAddress(String toAddress) {
		this.toAddress = toAddress;
	}
	public String getFromAddress() {
		return fromAddress;
	}
	public void setFromAddress(String fromAddress) {
		this.fromAddress = fromAddress;
	}
	public String getProfile() {
		return profile;
	}
	public void setProfile(String profile) {
		this.profile = profile;
	}
	
}
