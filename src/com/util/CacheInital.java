package com.util;

import java.util.Collections;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheFactory;
import net.sf.jsr107cache.CacheManager;

 public final class CacheInital {
	static CacheFactory cacheFactory;
	static Cache cache;
	/**
	 * Creating Cache Instance 
	 * @return
	 */
	public static Cache getcacheInstance(){
		try {			
			cache  = CacheManager.getInstance().getCacheFactory().createCache(Collections.emptyMap());
		} catch (CacheException e) {
			// TODO Auto-generated catch block
			System.err.println(e.getMessage());
		}
		return cache;
	}
	
}
