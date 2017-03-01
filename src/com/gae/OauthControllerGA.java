package com.gae;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.HashSet;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jdo.PMFSingleton;
import com.jdo.UserDetails;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.analytics.AnalyticsScopes;
import com.google.api.services.oauth2.Oauth2;
import com.google.api.services.oauth2.model.Userinfo;

@Controller
public class OauthControllerGA {
	final static JacksonFactory JSON_FACTORY = new  JacksonFactory();
    final static HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    static HashSet<String> scopes = new HashSet<String>();
    static GoogleAuthorizationCodeRequestUrl url;
    String location;    
    ObjectMapper jsonMap = new ObjectMapper();
    JSONObject jsonObj = new JSONObject();
	JSONParser parser = new JSONParser();    
	static Logger log = Logger.getLogger("LogInfo");	
	static Date printTime = new Date();
	static GoogleClientSecrets clientSecrets = clientSecrets();
	static String clientId = clientSecrets.getWeb().getClientId();
	static String clientSecret =clientSecrets.getWeb().getClientSecret();
	static String redirectedurl=clientSecrets.getWeb().getRedirectUris().get(0);
	
	@RequestMapping(value="/oauth2callback")
	public String callback(HttpServletRequest req,HttpServletResponse resp){
		Credential credential;
		String code = req.getParameter("code");
		Oauth2 userService;
		Userinfo userInfo;
		HttpSession session;
		String emailid;
		if(req.getParameter("code")!=null|| req.getParameter("code")!=""){
			credential = getCredential(code);
			
			log.info(printTime+"Checking code "+ code);
			log.info(printTime+"Checking credential "+ credential);
//			credential.refreshToken();

			//userService = new Oauth2.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential).setApplicationName("Web Analytics").build();
			userService = new Oauth2.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential).setApplicationName("OauthG").build();
			try{

				userInfo = userService.userinfo().get().execute();
				emailid = userInfo.getEmail();
				session = req.getSession();
				
		       log.info(printTime+"Checking for userInfo"+userInfo);
		       log.info(printTime+"Checking for user EmailId"+emailid);
		       log.info("What is the access token in the crendential object :: "+credential.getAccessToken());
		       log.info(printTime+"*****Checking for refreshtoken *****"+credential.getRefreshToken());
                System.out.println(" credential.getJsonFactory() === "+credential.getJsonFactory()+" ---- "+credential.getJsonFactory().toString());
                
				session.setAttribute("SESSION_USEREMAILID", emailid);
				session.setAttribute("USER_ACCESSTOKEN", credential.getAccessToken());
				session.setAttribute("USER_REFRESHTOKEN", credential.getRefreshToken());
				
				log.info(printTime+"Refresh token in oauthcallback method: "+ credential.getRefreshToken());
				location = "redirect:/home";
				
			}catch(IOException e){
				log.info("Redirect to LoginPage");
				try {
					resp.sendRedirect("/index.html");
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					log.warning("login page error");
				}
				
			}
		}else{
		    log.warning("code not get");
			
		}
		
		return location;
		
	}
	
	@RequestMapping(value="/home")
	public String homeRedirect(HttpServletRequest req, HttpServletResponse resp){
		HttpSession session =  req.getSession(false);
		String urlLocation = null;
		if(session != null && session.getAttribute("SESSION_USEREMAILID")!=null){
			log.info(printTime+"redircted home");
			storeRefreshtoken((String)session.getAttribute("SESSION_USEREMAILID"),(String)session.getAttribute("USER_REFRESHTOKEN"));
			//storeRefreshtoken((String)session.getAttribute("SESSION_USEREMAILID"),(String)session.getAttribute("USER_REFRESHTOKEN"));

			urlLocation = "home";
			
		}
		
		else{
			try {
				resp.sendRedirect("/index.html");
			} catch (IOException e) {
				log.warning(printTime+"Problem in response redirection");
			}
		}
	return urlLocation;
		
	}
	
	@RequestMapping(value="/logout")
	public void Logout(HttpServletRequest req, HttpServletResponse resp) throws IOException{
		log.info(printTime+"Inside Logout Method");
		HttpSession session = req.getSession(false);
		session.invalidate();
		//return "logout";
		//return "index.html";
		resp.sendRedirect("/index.html");
		return;
	}
	
	/**
	 * Saving User Profile
	 */
	@RequestMapping(value="/profilesave")
	public @ResponseBody String saveProfile(@RequestBody String profileData,HttpServletRequest req){
		log.info(profileData);
		try {
			jsonObj = (JSONObject) parser.parse(profileData);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			System.err.println(e.getMessage());
		}
		
		
		return profileData;
		
	}
	
	
	
	
	public void storeRefreshtoken(String userId, String refreshtoken) {
		
		log.info(printTime+"Checking UserId in SRT: "+userId);
		log.info(printTime+"Checking refreshtoken in SRT: "+refreshtoken);
	
		//PersistenceManager pm = PMF.get().getPersistenceManager();
    
		
		//PersistenceManager  pm = PMFSingleton.getPMF().getPersistenceManager();
		PersistenceManager pm = PMFSingleton.getPMF().getPersistenceManager();
		System.out.println("Refreshtoken :: "+refreshtoken);
		System.out.println("pmf :: "+pm);
		if(refreshtoken !=null || refreshtoken!=""){
			UserDetails details = new UserDetails();
			details.setEmailid(userId);
			details.setRefreshtoken(refreshtoken);
			try{
				pm.makePersistent(details);
			}catch(Exception e){
				log.warning(printTime+"Error in presisting userdetails");
			}
			finally{
				pm.close();
			}
		}else
			log.info("No refreshtoken");

	
		
		
	}

	private Credential getCredential(String code) {
		// TODO Auto-generated method stub
		GoogleTokenResponse tokenResponse;
		try {			
			log.info(printTime+"Authorization code: "+code);
			log.info(printTime+"<<<<HTTP_TRANSPORT in getCredential()>>>>: "+HTTP_TRANSPORT);
			log.info(printTime+"<<<<JSON_FACTORY in getCredential():>>>> "+JSON_FACTORY);
			log.info(printTime+"<<<<clientID in getCredential():>>>> "+clientId);
			log.info(printTime+"<<<<clientSecret in getCredential():>>>> "+clientSecret);
			log.info(printTime+"<<<<RedirectedUrl in getCredential():>>>> "+redirectedurl);
			
			tokenResponse = new GoogleAuthorizationCodeTokenRequest(HTTP_TRANSPORT,JSON_FACTORY,clientId,clientSecret,code,redirectedurl).execute();
			//tokenResponse = new GoogleAuthorizationCodeTokenRequest(HTTP_TRANSPORT,JSON_FACTORY,clientSecrets.getWeb().getClientId(),clientSecrets.getWeb().getClientSecret(),code,clientSecrets.getWeb().getRedirectUris().get(0)).execute();
			System.out.println(" tokenResponse.getAccessToken() .... :: "+tokenResponse.getAccessToken());
			System.out.println(" tokenResponse.getIdToken() .... :: "+tokenResponse.getIdToken());
			System.out.println(" tokenResponse.getRefreshToken() .... :: "+tokenResponse.getRefreshToken());
			System.out.println(" tokenResponse.getTokenType() .... :: "+tokenResponse.getTokenType());
			System.out.println(" tokenResponse.getExpiresInSeconds() .... :: "+tokenResponse.getExpiresInSeconds());
			System.out.println(" tokenResponse.getClassInfo() .... :: "+tokenResponse.getClassInfo());
			return new GoogleCredential.Builder().setClientSecrets(clientSecrets).setJsonFactory(JSON_FACTORY).setTransport(HTTP_TRANSPORT).build().setAccessToken(tokenResponse.getAccessToken()).setRefreshToken(tokenResponse.getRefreshToken());
		} catch (IOException e) {
			log.warning(printTime+"Problem in sending code or creating credential object");
		}
		return null;
	}


	@RequestMapping(value="/Login")
	public void googleLoginUrl(HttpServletResponse response){
		try{
			log.info(printTime+"Started Loging");
			response.sendRedirect(getBuildinLoginUrl());
		}catch(IOException e){
			log.warning(printTime+"Probelm in response redirection");
			
		}
	}
	
		
	
	private String getBuildinLoginUrl() {
		// TODO Auto-generated method stub
		scopes.add(AnalyticsScopes.ANALYTICS_READONLY);
        scopes.add("https://www.googleapis.com/auth/userinfo.email");
        url = new GoogleAuthorizationCodeRequestUrl(clientId,redirectedurl,scopes).setAccessType("offline");
	     log.info(printTime+"buildlogin"); 
		
		return url.build();
	}



	private static GoogleClientSecrets clientSecrets() {
		
		// TODO Auto-generated method stub
		try{
			log.info(printTime+"clientSecrets");
			return GoogleClientSecrets.load(JSON_FACTORY,new InputStreamReader(OauthControllerGA.class.getResourceAsStream("client_secret.json")));
		}catch(Exception e){
			log.warning("Problem in getting Client Secrets");
		}
		return null;
	}
	

}
