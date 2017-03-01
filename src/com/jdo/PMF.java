package com.jdo;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

public class PMF {

	private static PersistenceManagerFactory pmfInstance = JDOHelper.getPersistenceManagerFactory("transactions-optional");

	private PMF() {

	}

	public static PersistenceManagerFactory get() {
		System.out.println("i am getting the instance of the manager....");
		return pmfInstance;
	}
}
