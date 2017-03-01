package com.gae;

import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.util.ByteArrayDataSource;
import javax.servlet.http.HttpServletRequest;


















import net.sf.jsr107cache.Cache;












//import org.json.CDL;
//import org.json.JSONArray;
//import org.json.JSONException;
//import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller

public class SendingEmail {
	
	JSONObject jsonObject = new JSONObject();
	JSONObject tempObject = new JSONObject();
	JSONParser jsonParser = new JSONParser();
	static Cache cache;
	
	JSONArray column,row,rowvalue;
	String CSV ="";
	/**
	 * Sending the email to user
	 * @param req
	 */
	@RequestMapping(value="/sendemail")
	@ResponseBody
	public void emailSending(HttpServletRequest req){
		
		String emailId, accesstoken,queryid,subject;
		String csvData = null;	
		
		emailId= req.getParameter("emailId");
		accesstoken = req.getParameter("accessToken");		
		queryid = req.getParameter("queryid");
		subject = req.getParameter("subject");
		csvData = AnalyticsController.getGaData(queryid,accesstoken);
		StringBuilder mailData = new StringBuilder();		
		try {
			jsonObject = (JSONObject) jsonParser.parse(csvData);
		} catch (ParseException e1) {
			
			System.out.println("Json Parseing error: "+ e1.getStackTrace());
		}
		column =  (JSONArray) jsonObject.get("columnHeaders");
		row =  (JSONArray) jsonObject.get("rows");
		
		//System.out.println(column.toJSONString());
		
		for(int k =0;k< column.size()-1;k++ ){
          tempObject = (JSONObject) column.get(k);
          mailData.append(tempObject.get("name")+",");
		}
		mailData.append("\n\r");
		rowvalue = new JSONArray();
		for(int t= 0;t< row.size();t++){
			//tempObject = (JSONObject) row.get(t);
			rowvalue = (JSONArray) row.get(t);
			for(int v=0;v<rowvalue.size()-1;v++){
				//tempObject = (JSONObject) rowvalue.get(v);
				mailData.append((rowvalue.get(v).toString().indexOf(',') == -1 ? rowvalue.get(v).toString() : rowvalue.get(v).toString().replaceAll(","," "))+",");
			}
			mailData.append("\n");
		}
	//	System.out.println(mailData.toString());
		sendEmail( mailData.toString(), emailId,"Report.csv",subject);
		
		
		   
	}
	/**
	 * Method for sending email
	 * @param data
	 * @param emailId
	 * @param filename
	 * @param subject
	 */
	public static void sendEmail(String data,String emailId,String filename,String subject){
		Properties properties = new Properties();
		 Multipart multipart = new MimeMultipart();
	//	 MimeBodyPart htmlBodyPart = new MimeBodyPart();
		 MimeBodyPart attachment = new MimeBodyPart();
		 DataSource sourcedata;
		Session session = Session.getDefaultInstance(properties);
		byte[] attachmentData = data.getBytes();
		
		Message message = new MimeMessage(session);
		try {
			message.setFrom(new InternetAddress("solomon.mark@a-cti.com","Admin"));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(emailId,"Mr.User"));
			message.setSubject(subject);
			message.setText("Google Analytics data in the Body");
			//htmlBodyPart.setContent(message,"text/html"); 
			//multipart.addBodyPart(htmlBodyPart);
			attachment.setFileName(filename);
			sourcedata = new ByteArrayDataSource(attachmentData,"text/comma-separated-values");
			attachment.setDataHandler(new DataHandler(sourcedata));
			multipart.addBodyPart(attachment);
			message.setContent(multipart);
			Transport.send(message);
			System.out.println("Email Send Success");
			
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			System.out.println("Problem in UnSupportedEncoding: "+ e.getStackTrace());
		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			System.out.println("Problem in Mailing : "+ e.getStackTrace());
		}
		
	}
	


}
