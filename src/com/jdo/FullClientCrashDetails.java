package com.jdo;

import javax.jdo.annotations.PersistenceCapable;

import com.google.appengine.api.datastore.Text;

@PersistenceCapable
public class FullClientCrashDetails
	{
		private String userEmailId;
		private String mode;
		private String appVersion;
		private String engine;
		private String dateAddedInMillisecond;
		private String ipaddress;
		private String platform;
		private String os;
		private String dumpfilelink;

		public String getDumpfilelink()
			{
				return dumpfilelink;
			}

		public void setDumpfilelink( String dumpfilelink )
			{
				this.dumpfilelink = dumpfilelink;
			}

		public String getDateAddedInMillisecond()
			{
				return dateAddedInMillisecond;
			}

		public void setDateAddedInMillisecond( String dateAddedInMillisecond )
			{
				this.dateAddedInMillisecond = dateAddedInMillisecond;
			}

		public String getIpaddress()
			{
				return ipaddress;
			}

		public void setIpaddress( String ipaddress )
			{
				this.ipaddress = ipaddress;
			}

		public String getPlatform()
			{
				return platform;
			}

		public void setPlatform( String platform )
			{
				this.platform = platform;
			}

		public String getOs()
			{
				return os;
			}

		public void setOs( String os )
			{
				this.os = os;
			}

		public String getUserEmailId()
			{
				return userEmailId;
			}

		public void setUserEmailId( String userEmailId )
			{
				this.userEmailId = userEmailId;
			}

		public String getMode()
			{
				return mode;
			}

		public void setMode( String mode )
			{
				this.mode = mode;
			}

		public String getAppVersion()
			{
				return appVersion;
			}

		public void setAppVersion( String appVersion )
			{
				this.appVersion = appVersion;
			}

		public String getEngine()
			{
				return engine;
			}

		public void setEngine( String engine )
			{
				this.engine = engine;
			}

	}
