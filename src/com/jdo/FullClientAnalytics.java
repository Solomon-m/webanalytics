package com.jdo;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class FullClientAnalytics
	{
		private String eventLabel;
		private String eventCategory;
		private String eventAction;
		private String connId;
		private String incomingANI;
		private String eventTime;
		private String loadTime;
		
		public String getEventCategory()
			{
				return eventCategory;
			}
		public void setEventCategory( String eventCategory )
			{
				this.eventCategory = eventCategory;
			}
		public String getEventAction()
			{
				return eventAction;
			}
		public void setEventAction( String eventAction )
			{
				this.eventAction = eventAction;
			}
		public String getEventLabel()
			{
				return eventLabel;
			}
		public void setEventLabel( String eventLabel )
			{
				this.eventLabel = eventLabel;
			}
		public String getConnId()
			{
				return connId;
			}
		public void setConnId( String connId )
			{
				this.connId = connId;
			}
		public String getIncomingANI()
			{
				return incomingANI;
			}
		public void setIncomingANI( String incomingANI )
			{
				this.incomingANI = incomingANI;
			}
		public String getEventTime()
			{
				return eventTime;
			}
		public void setEventTime( String eventTime )
			{
				this.eventTime = eventTime;
			}
		public String getLoadTime()
			{
				return loadTime;
			}
		public void setLoadTime( String loadTime )
			{
				this.loadTime = loadTime;
			}
		

	}
