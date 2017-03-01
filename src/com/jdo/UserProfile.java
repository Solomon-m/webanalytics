package com.jdo;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class UserProfile implements Serializable{
    
	/**
	 *
	 **
	 */
	private static final long serialVersionUID = 1L;

	@PrimaryKey
	//@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	//@Extension(vendorName="datanucleus", key="gae.encoded-pk", value="true")
	private String userId;	
	private String queryName;	
	@Persistent(serialized = "true")
	private LinkedHashMap<String, Map<String,String>> querydetails;		
	private String dateAdded;
	
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}	
	public String getDateAdded() {
		return dateAdded;
	}
	public void setDateAdded(String dateAdded) {
		this.dateAdded = dateAdded;
	}
	public String getQueryName() {
		return queryName;
	}
	public void setQueryName(String queryName) {
		this.queryName = queryName;
	}
	public LinkedHashMap<String, Map<String,String>> getQuerydetails() {
		return querydetails;
	}
	public void setQuerydetails(LinkedHashMap<String, Map<String,String>> querydetails) {
		System.out.println(querydetails);
		this.querydetails = querydetails;
	}
}
