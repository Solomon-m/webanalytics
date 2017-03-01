package com.jdo;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManagerFactory;

public final class PMFSingleton {
	public PMFSingleton() {
		// TODO Auto-generated constructor stub
	}
	private static final PersistenceManagerFactory pmfInstance= JDOHelper.getPersistenceManagerFactory("transactions-optional");
	public static PersistenceManagerFactory getPMF(){
		System.out.println("Inside PMFSingleton().getPMF method..");
		return pmfInstance;
	}

}
