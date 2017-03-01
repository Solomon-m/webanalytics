<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<title>CrashReport</title>
<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
<script src="http://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
<!-- <script src="/js/jquery.FileDownload.js"></script> -->
<script type="text/javascript" src="/JS/jquery.fileDownload.js"></script>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css">
  <!-- <link rel="stylesheet" type="text/css" href="/css/bootstrap.css"> -->
  <link rel="stylesheet" type="text/css" href="/css/OBreport.css">
<script type="text/javascript">
$(function() {
$( "#fromDate" ).datepicker();
$( "#toDate" ).datepicker();
});

function generateReport()
{ 
	
	  
	var fdate = $('#fromDate').val();      
	var tdate =$('#toDate').val();
	var emailid = $('#emailId').val();
	var mode = $('#mode').val();
	var param; 
	console.log("Fromdate is ::"+fdate);
	console.log("Todate is ::"+tdate);
	console.log("Mode is:"+$('#mode').val());
	console.log("emailId is:"+$('#emailId').val());
// 	$.ajax({
//         url: 'http://localhost:8888/AgentInfoAction/fetchOutboundData.do',
//         data: "from=" +$('#fromDate').val() + "&to=" + $('#toDate').val(),
//         success: function (response) {
//            console.log('succeeded');
//            $('#loading').hide();
//         }
//     });

	// /AgentInfoAction/fetchOutboundData.do?
	if(mode && emailid){
		param = 'from=' +$('#fromDate').val() + '&to=' + $('#toDate').val() +'&mode=' +$('#mode').val()+'&emailId='+$('#emailId').val();
	}else if(mode && !emailid){
		param = 'from=' +$('#fromDate').val() + '&to=' + $('#toDate').val() +'&mode=' +$('#mode').val();
	}else if(emailid && !mode){
		param = 'from=' +$('#fromDate').val() + '&to=' + $('#toDate').val() +'&emailId='+$('#emailId').val();
	}else{
		param = 'from=' +$('#fromDate').val() + '&to=' + $('#toDate').val();
	}	
	console.log("param to server:",param);
	$.fileDownload('/getFullClientCrashData?'+param, {
	    successCallback: function (url) {
	 
	    	console.log('succeeded new');
	         
	    },
	    failCallback: function (html, url) {
	 
	    }
	});
	
}
</script>
</head>
<body class="bodybgcolor">
<div class="div1">
<fieldset class="fieldsetforObreport">
    <legend class="oblegend"><b>FULLClient CrashReport</b> </legend>
         <table> 
         <tr></tr></br>
         <tr></tr></br>
         <tr></tr></br>
         <tr></tr></br>
         <tr>UserEmailId : <input type="text" name="emailId" id="emailId"></tr></br>
         <tr></tr></br>
         <tr>&nbsp;Mode &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;<input type="text" name="mode" id="mode"></tr></br>
         <tr></tr></br>
         <tr>From : &nbsp;&nbsp; <input type="text" name="fromDate" id="fromDate"> </tr>
         <tr>&nbsp;To : &nbsp;&nbsp; <input type="text" name="toDate" id="toDate"></tr></br>
         <tr></tr></br>
         <tr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" name="generateReport" value="Generate Report" onclick="generateReport()"></tr>
         </table> 
</fieldset>
</div>
</body> 
<!--  <body>
 <div class="div1">
    <form class="form-horizontal">
  <div class="form-group">
    <label for="inputEmail3" class="col-sm-2 control-label">From</label>
    <div class="col-sm-10">
      <input type="text" name="fromDate" id="fromDate">
    </div>
  </div>
  <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">To</label>
    <div class="col-sm-10">
      <input type="text" name="toDate" id="toDate">
    </div>
  </div>
 <div class="form-group">
    <label for="inputPassword3" class="col-sm-2 control-label">Mode</label>
    <div class="col-sm-10">
      <input type="text" class="form-control" id="inputPassword3" placeholder="mode">
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <input type="button" name="generateReport" value="Generate Report" onclick="generateReport()">
    </div>
  </div>
</form>
</div>
 </body> -->
</html>