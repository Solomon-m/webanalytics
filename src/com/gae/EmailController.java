package com.gae;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;
import javax.jdo.Transaction;
import javax.servlet.http.HttpServletRequest;

import net.sf.jsr107cache.Cache;


import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.mortbay.log.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jdo.EmailDetails;
import com.jdo.PMFSingleton;
import com.jdo.UserDetails;
import com.jdo.UserProfile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.auth.oauth2.RefreshTokenRequest;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.http.GenericUrl;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;



@Controller
public class EmailController {
	static Logger log = Logger.getLogger("LogInfo");
	 static JSONObject jsonObject = new JSONObject();
	static 	JSONParser jsonParser = new JSONParser();    
	static Cache cache;
	static ObjectMapper jsonMap = new ObjectMapper();
	PersistenceManager pm;
	Transaction tx ;
	
	/**
	 * Send the Email to user with Attachment
	 * @param emailData
	 * @param req
	 * @return success message to client
	 */
	//Handle Email url Request
	@RequestMapping(value="/emailRequest")
	public @ResponseBody String emailTask(@RequestBody String emailData, HttpServletRequest req){
		String emailid = null,querydata = null,subject = null;
		String accessToken = (String) req.getSession().getAttribute("USER_ACCESSTOKEN");	
		req.getSession().getAttribute("SESSION_USEREMAILID");
		log.info("EmailData: "+emailData);
		try {
			jsonObject = (JSONObject) jsonParser.parse(emailData);
			emailid= (String) jsonObject.get("toAddress");
			querydata = jsonObject.get("queryId").toString();
			subject = (String) jsonObject.get("subject");
			System.out.println("queryid getting:" + querydata);
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			log.warning(e.getMessage());
		}
		 

		Queue taskQueue = QueueFactory.getQueue("EmailQueue");
		taskQueue.add(TaskOptions.Builder.withUrl("/sendemail").param("emailId", emailid).param("queryid", querydata).param("accessToken", accessToken).param("subject", subject));
		return "{\"status\":\"Success\"}";
	}
	/**
	 * Email Schedule for the report
	 * @param data
	 * @param req
	 * @return
	 */
	@RequestMapping(value="/scheduleemail")	
	public @ResponseBody String scheduleEmail(@RequestBody String data, HttpServletRequest req){
		
		System.out.println(data);
		try {
			jsonObject = (JSONObject) jsonParser.parse(data);
		} catch (ParseException e) {
			Log.warn(e.getMessage());
		}
		
//		Calendar.getInstance().getTimeInMillis();
		String fromAddress =(String) jsonObject.get("fromAddress");
		String toAddress = (String)jsonObject.get("toAddress");
		long frequent = (Long)jsonObject.get("frequent");
		long subfreq = (Long)jsonObject.get("subfreq");
//		(Long)jsonObject.get("frequent");
		String queryid = (String) jsonObject.get("queryId");
		String subject = (String) jsonObject.get("subject");
		jsonObject.get("subject");
		
		EmailDetails emailDetails = new EmailDetails();
		emailDetails.setFromAddress(fromAddress);
		emailDetails.setToAddress(toAddress);
		emailDetails.setfrequent(frequent);
		emailDetails.setSubfreq(subfreq);
		emailDetails.setQueryId(queryid);
		emailDetails.setSubject(subject);
		
		
		try{
			pm = PMFSingleton.getPMF().getPersistenceManager();		
			tx =pm.currentTransaction();
			tx.begin();
			pm.makePersistent(emailDetails);
		}		
		finally{
			tx.commit();
			pm.close();
		}
		
		
		System.out.println("email value"+data);
		System.out.println("email shcdeule");
		return "success1";
		
	}
	
	/**
	 * Cron service for sending the schdule report
	 */
	@RequestMapping(value = "/cron_email")
	public @ResponseBody void cronScheduleEmail(){
		SimpleDateFormat dataformat = new SimpleDateFormat("yyyy-MM-dd");
		
		pm = PMFSingleton.getPMF().getPersistenceManager();		
		Calendar calendar = new GregorianCalendar();
		Calendar calendar1;
		Queue taskQueue = QueueFactory.getQueue("EmailQueue");
		Query query = pm.newQuery(EmailDetails.class);
		List<EmailDetails> mailDetails = (List<EmailDetails>) query.execute();
		for(EmailDetails em : mailDetails){
				System.out.println(em.getFromAddress()+" "+em.getToAddress()+" "+em.getfrequent()+ " "+em.getSubfreq()+" "+em.getQueryId()+" "+em.getSubject());
		UserProfile profile = pm.getObjectById(UserProfile.class,em.getFromAddress());
		LinkedHashMap<String, Map<String, String>> map = profile.getQuerydetails();
		//System.out.println(profile.getQuerydetails().toString());		
		Map<String, String> querydetails = map.get(em.getQueryId());
		//System.out.println(querydetails.toString());
		//System.out.println(em.getfrequent().intValue());
		String querydata = null;
		
		if(em.getfrequent().intValue() == 1){
			System.out.println("daily");
			calendar1 = new GregorianCalendar();
			calendar1.add(Calendar.DATE, -1);
			String reportdate = dataformat.format(calendar1.getTime()).toString();
			System.out.println(querydetails.toString());
			querydetails.put("startDate", reportdate);
			querydetails.put("endDate", reportdate);
			log.info(querydetails.toString());
			try {
				querydata = jsonMap.writeValueAsString(querydetails);
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				log.warning(e.getMessage());
			}
			String accessToken = getGadatabyEmail(em);			
			taskQueue.add(TaskOptions.Builder.withUrl("/sendemail").param("emailId", em.getToAddress()).param("queryid",querydata) .param("accessToken", accessToken).param("subject", em.getSubject()));
			calendar1 = null;
		}
		else if(em.getfrequent().intValue() == 2){
			if(em.getSubfreq().intValue() == calendar.get(Calendar.DAY_OF_WEEK)){
				String startDate,endDate;
				calendar1 = new GregorianCalendar();
				calendar1.add(Calendar.DATE, -1);
				 endDate = dataformat.format(calendar1.getTime()).toString();
				 calendar1.add(Calendar.DATE, -6);
				 startDate =  dataformat.format(calendar1.getTime()).toString();
				querydetails.put("startDate", startDate);
				querydetails.put("endDate", endDate);
				log.info(querydetails.toString());
				try {
					querydata = jsonMap.writeValueAsString(querydetails);
				} catch (JsonProcessingException e) {
					// TODO Auto-generated catch block
					log.warning(e.getMessage());
				}
				System.out.println("Weekly");
				String accessToken = getGadatabyEmail(em);				
				taskQueue.add(TaskOptions.Builder.withUrl("/sendemail").param("emailId", em.getToAddress()).param("queryid", querydata).param("accessToken", accessToken).param("subject", em.getSubject()));
			}
			
		}
		else if(em.getfrequent().intValue() == 3 ){
			if(em.getSubfreq().intValue() == calendar.get(Calendar.DAY_OF_MONTH)){
				String startDate,endDate;
				calendar1 = new GregorianCalendar();
				calendar1.add(Calendar.DATE, -1);
				 endDate = dataformat.format(calendar1.getTime()).toString();
				 calendar1.add(Calendar.MONTH, -1);
				 startDate =  dataformat.format(calendar1.getTime()).toString();
				querydetails.put("startDate", startDate);
				querydetails.put("endDate", endDate);
				log.info(querydetails.toString());
				try {
					querydata = jsonMap.writeValueAsString(querydetails);
				} catch (JsonProcessingException e) {
					// TODO Auto-generated catch block
					log.warning(e.getMessage());
				}
				
				
				System.out.println("Monthly");
				String accessToken= getGadatabyEmail(em);				
				taskQueue.add(TaskOptions.Builder.withUrl("/sendemail").param("emailId", em.getToAddress()).param("queryid", querydata).param("accessToken", accessToken).param("subject", em.getSubject()));
			}
		}
		

		}
	}
/**
 * Getting Refresh token by UserEmailId from datastore
 * @param em
 * @return
 */
	private String getGadatabyEmail(EmailDetails em){
		UserDetails user = pm.getObjectById(UserDetails.class,em.getFromAddress() );
		String refreshtoken = user.getRefreshtoken();		
		String accesstoken = getAccesstoken(refreshtoken);		
		
		
		return accesstoken;
	}
	/**Method for getting the accesstoken by Refreshtoken
	 * 
	 * @param refreshToken
	 * @return
	 */
	private String getAccesstoken(String refreshToken) {
		// TODO Auto-generated method stub
		TokenResponse tokenrequest = null ;
		try {
			tokenrequest = new RefreshTokenRequest(OauthControllerGA.HTTP_TRANSPORT, OauthControllerGA.JSON_FACTORY,new GenericUrl( "https://accounts.google.com/o/oauth2/token"), refreshToken).set("client_id", OauthControllerGA.clientId).set("client_secret", OauthControllerGA.clientSecret).execute();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			Log.warn(e.getMessage());
		}
		
		return tokenrequest.getAccessToken();
	}
}
