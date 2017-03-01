<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE HTML>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Web Analytics</title>
   <script src="/JS/jquery-2.1.0.js"></script>
<link href="/css/bootstrap.css" rel="stylesheet" type="text/css" />
<script src="/JS/bootstrap.js"></script>
<script src="/JS/jquery.tablesorter.min.js"></script>

<link rel="stylesheet" href="/css/jquery-ui.css">

  <script src="/JS/jquery-ui.js"></script>
  <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  <script type="text/javascript" src="/JS/jScripts.js"></script>
  <script type="text/javascript" src="/JS/util.js"></script>
  <script type="text/javascript" src="/JS/profileload.js"></script>
  <script type="text/javascript" src="/JS/notify.min.js"></script>
  <script>
 
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-53411201-1', 'web-analytics-demo.appspot.com');
	  ga('send', 'pageview');

</script>
  <link rel="stylesheet" href="/css/style.css">
  
</head>
<body>
   <div id="Header">
   You are Authorized as 
  <span id="emailInfo" onload= "_gaq.push(['_trackEvent', 'UserLoged', 'UserEmailid', this.value]);"> <%= session.getAttribute("SESSION_USEREMAILID") %> </span><a href="/logout">Logout</a>
   </div>
   
   <div class="row">  
   <div id="formvalues" class="col-sm-6">
  
   <form class="form-horizontal" role="form">
        <div class="form-group">
          <label  class="col-sm-4 control-label">Account</label>
          <div class="col-sm-6">
            <select class="form-control" id="accountName"></select>
          </div>
        </div>
        <div class="form-group">
          <label  class="col-sm-4 control-label">Webproperties</label>
          <div class="col-sm-6">
            <select class="form-control" id="propName"></select>
          </div>
        </div>
        <div class="form-group">
          <label  class="col-sm-4 control-label">Profile</label>
          <div class="col-sm-6">
            <select class="form-control" id="profName"></select>
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Table Id<span id="required">*</span></label>
          <div class="col-sm-6">
            <input type="text" class="form-control" placeholder="Select the Profile Name" id="tabl" required>
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Dimension<span id="required">*</span></label>
          <div class="col-sm-6">
            <input type="text" class="form-control" placeholder="Ex. ga:visitCount" id='dimension_val' required>  
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Metrics<span id="required">*</span></label>
          <div class="col-sm-6">
            <input type="text" class="form-control"  placeholder="Ex. ga:visits" id='metric_value' required> 
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Segment</label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="segment" placeholder="Ex. dynamic::ga:country=~Pakistan" >
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Filter</label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="filter" placeholder="Ex. ga:city==Chennai" >
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Sort</label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="sort" placeholder="Ex. ga:visits" >
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">Start Date<span id="required">*</span></label>
          <div class="col-sm-6">
            <input type="text" class="form-control datepicker" id="startdate" placeholder="Click & Select Start Date" required>
          </div>
        </div>
         <div class="form-group">
          <label  class="col-sm-4 control-label">End Date<span id="required">*</span></label>
          <div class="col-sm-6">
            <input type="text" class="form-control datepicker" id="enddate" placeholder="Click & Select End Date" required>
          </div>
        </div>
        <div class="form-group">
          <label  class="col-sm-4 control-label">MaxResults</label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="maxResults" value=100>
          </div>
        </div>    
        <div class="form-group">
          
          <div class="col-sm-4">
            <button type="button" class="btn btn-primary" id="saveprofile">Save Profile</button>
          </div>
          <div class="col-sm-offset-3 col-sm-4">
            <button type="button" class="btn btn-info" id="getdata">Get Data</button>
          </div>
        </div>
      </form>
 </div>
  <div class="col-sm-4"><div class="col-sm-12" id="emaildivi"><div><input type = "button" value ="" id = "email"  data-toggle="modal" data-target="#myModal" /><input type="email" id="emailId"><input type="button" value="Send" id="sendEmail">
 <input type='button' value='' id='download' /></div><div id="vh"></div></div><div class="col-sm-12" id="userProfile"><div class ="col-sm-12" id="lastresult">Get Last Result</div><div class="col-sm-12" id="profilelists"><b>Userdefined Profile List</b></div><div id="getuserprofile" ></div><br/></div></div>  
 </div>
     <!-- <div class="form-group">
       <button type="button" class="btn btn-info"  id='saveProfile'>Save Into Profile</button>
    </div> --> 
 <div class='col-sm-12' id="gaheader">
 <div>
 <button type="button" id="showQuery" >ShowQuery</button>&nbsp;&nbsp;
  <select id="dimension_grp" ></select> &nbsp;&nbsp;
  <select id="dimension_srh" ></select>&nbsp;&nbsp;
  <input type='text'  id="dimen_val" >&nbsp; <button type="button" id="srch_dimen" >Search</button>
 </div>
  
 </div>
 
  
 
<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title" id="myModalLabel">Email </h4>
      </div>
      <div class="modal-body">
        <form class='form-horizontal' role='form'>
          <div class='form-group'>
            <label class="col-sm-2 control-label">From</label>
            <div class="col-sm-6"><input type="text" class="form-control" id="fromEmail" value='<%= session.getAttribute("SESSION_USEREMAILID") %>' disabled></div>
          </div>
          <div class='form-group'>
            <label class="col-sm-2 control-label">To</label>
            <div class="col-sm-6"><input type="email" class="form-control" id="toEmail" ></div>
          </div>
          <div class='form-group'>
            <label class="col-sm-2 control-label">Subject</label>
            <div class="col-sm-6"><input type="text" class="form-control" id="subject" ></div>
          </div>
           <div class='form-group'>
            <label class="col-sm-2 control-label">frequency</label>
            
              <div class="col-sm-4" id="dateselect">
                <select class="form-control col-sm-5" id="freq">
      <option>Once</option>
      <option>Daily</option>
      <option>Weekly</option>
      <option>Monthly</option>
  </select>
             
              
            </div>
             <div class="col-sm-4" id="secondselect" > <select id='weekdays' class='form-control col-sm-5'></select></div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" id="emailschedule" data-dismiss="modal">Send</button>
      </div>
    </div>
  </div>
</div>
   <br/><br/><div><p id="totalcountrep"></p></div>
    
<div id="tablechart" >
</div>




</body>
</html>