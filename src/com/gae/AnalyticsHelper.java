package com.gae;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.TimeZone;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.servlet.http.HttpServletRequest;


import com.jdo.FullClientCrashDetails;
//import com.service.StackTraceWriter;
import com.jdo.PMF;

public class AnalyticsHelper
	{

	public String getCrashData( HttpServletRequest req )
		{
			try{
				System.out.println("Request reached getCrashData - AnalyticsHelper:FULLClientCrashDetails:");
				System.out.println( "From ::: " + req.getParameter( "from" ) + " , to ::: " + req.getParameter( "to" ) );
				@SuppressWarnings( "deprecation" )
				long from = convertToPSTMillisecond (new Date( req.getParameter( "from" ) ).getTime());
				@SuppressWarnings( "deprecation" )
				long to = convertToPSTMillisecond ( new Date( req.getParameter( "to" ) + " 23:59" ).getTime());
				String mode = req.getParameter("mode");
				String emailid = req.getParameter( "emailId" );
				String jdoQuery;
				PersistenceManager pm = PMF.get().getPersistenceManager();
				
				if(emailid !=null && mode!=null){
					jdoQuery = "SELECT FROM " + FullClientCrashDetails.class.getName() + " WHERE dateAddedInMillisecond <= '" + to
							+ "' && dateAddedInMillisecond >= '" + from + "'"+ " && mode == '"+mode+"'"+ " && userEmailId =='"+emailid+"'";	
				}else if(mode !=null && emailid == null){
					jdoQuery = "SELECT FROM " + FullClientCrashDetails.class.getName() + " WHERE dateAddedInMillisecond <= '" + to
							+ "' && dateAddedInMillisecond >= '" + from + "'"+ " && mode == '"+mode+"'";	
				}else if(emailid !=null && mode == null){
					jdoQuery = "SELECT FROM " + FullClientCrashDetails.class.getName() + " WHERE dateAddedInMillisecond <= '" + to
							+ "' && dateAddedInMillisecond >= '" + from + "'"+" && userEmailId =='"+emailid+"'";	
				}else{
					jdoQuery = "SELECT FROM " + FullClientCrashDetails.class.getName() + " WHERE dateAddedInMillisecond <= '" + to
							+ "' && dateAddedInMillisecond >= '" + from + "'";
				}
				
				
				System.out.println( " checking jdoQuery ::: " + jdoQuery );
				Query query = pm.newQuery( jdoQuery );
				System.out.println( "Before executing" );
				@SuppressWarnings( "unchecked" )
				List<FullClientCrashDetails> FullClientCrashDetailsList = (List<FullClientCrashDetails>) query.execute();
				
				System.out.println("List"+FullClientCrashDetailsList.size());
			
				LinkedList<String> fieldTitleList = new LinkedList<String> ();
				LinkedList<String> fieldValueList = new LinkedList <String>();
		
				fieldTitleList.add("userEmailId");
				fieldTitleList.add("mode");
				fieldTitleList.add("appVersion");
				fieldTitleList.add("platform");
				fieldTitleList.add("os");
				fieldTitleList.add("engine");
				fieldTitleList.add("dumpfilelink");
				fieldTitleList.add("ipaddress");
				fieldTitleList.add("dateAddedInMillisecond");
				fieldTitleList.add("\n");
				for(FullClientCrashDetails crashdata: FullClientCrashDetailsList){
					fieldValueList.add((crashdata).getUserEmailId());
					fieldValueList.add((crashdata).getMode());
					fieldValueList.add((crashdata).getAppVersion());
					fieldValueList.add((crashdata).getPlatform());
					fieldValueList.add((crashdata).getOs());
					fieldValueList.add((crashdata).getEngine());
					fieldValueList.add((crashdata).getDumpfilelink());
					fieldValueList.add((crashdata).getIpaddress());
					fieldValueList.add((crashdata).getDateAddedInMillisecond());
					fieldValueList.add("\n");
					
				}
//				System.out.println("-----------Gson ends------------");
//				Gson gson = new Gson();
//				String testgson = gson.toJson(fieldValueList);
//				System.out.println("Json is ::"+testgson);
//				System.out.println("-----------Gson ends------------");
				
				String response = fieldTitleList.toString().replace( "[" , "" ).replace( "]" , "" ).replace( ", " , "," )
						.replace( ",\n" , "\n" ).replace( "\n," , "\n" )
						+ fieldValueList.toString().replace( "[" , "" ).replace( "]" , "" ).replace( ", " , "," ).replace( ",\n" , "\n" )
						.replace( "\n," , "\n" );
				
//				System.out.println("--------chech response------");
//				System.out.println("Response is :::"+response);
				return response;
				}
				catch ( Exception e )
				{
					 System.out.println("Error in getting CrashData from datastore:"+e);
				 System.out.println("Error in getting CrashData from datastore:"+e.getMessage());
				//StackTraceWriter.printStackTrace( e );
				return null;
				}
		}

		public long convertToPSTMillisecond( long millisecond )
			{
				long addMillisecond = 0l;
				if ( TimeZone.getTimeZone( "America/Los_Angeles" ).inDaylightTime( new Date() ) )
					addMillisecond = 25200000l;
				else
					addMillisecond = 28800000l;
				Date adjustedDate = new Date( millisecond + addMillisecond );
				return adjustedDate.getTime();
			}
		

	}
