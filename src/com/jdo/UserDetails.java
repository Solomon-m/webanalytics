package com.jdo;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class UserDetails {
	@PrimaryKey
 private String emailid;
private String refreshtoken;
public String getEmailid() {
	return emailid;
}
public void setEmailid(String emailid) {
	this.emailid = emailid;
}
public String getRefreshtoken() {
	return refreshtoken;
}
public void setRefreshtoken(String refreshtoken) {
	this.refreshtoken = refreshtoken;
}


}
