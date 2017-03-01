<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Web Analytics</title>
  <link href="/css/bootstrap.css" rel="stylesheet" type="text/css"/>
    <link href="/css/bootstrap-responsive.css" rel="stylesheet" type="text/css"/>
    <link href="/css/jquery-ui.css" rel="stylesheet" type="text/css"/>
    <link href="/css/style.css" rel="stylesheet" type="text/css"/>
    
     <script src="/JS/jquery-2.1.0.js"></script> 
  <link href="/css/bootstrap.css" rel="stylesheet" type="text/css"/>
   <script src="/JS/bootstrap.js"></script>
   <script src="/JS/jquery.tablesorter.min.js"></script> 
   <link rel="stylesheet" href="/css/jquery-ui.css">
    <script src="/JS/jquery-ui.js"></script> 
     <script type="text/javascript" src="/JS/jScripts.js"></script> 
    <script type="text/javascript" src="/JS/util.js"></script> 
    <script type="text/javascript" src="/JS/profileload.js"></script>
     <script type="text/javascript" src="/JS/notify.min.js"></script>
     <!-- Google Analytics starts -->
     <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-53411201-1', 'web-analytics-demo.appspot.com');
  ga('send', 'pageview');

</script>
     <!-- Google Anlaytics ends -->
</head>
<body> 
  <div id="Header"><span id="emailInfo" onload="_gaq.push(['_trackEvent', 'UserLoged', 'UserEmailid', this.value]);"> <%= session.getAttribute("SESSION_USEREMAILID") %> </span>Welcome to Web Analytics <a href="/logout">Logout</a> </div> 
 <div class="row"> <!-- User defined Query list and Query form div's resides in a row. That row starts -->
 <div id="formvalues" class="col-sm-6"> 
 <form class="form-horizontal" role="form">
   <fieldset >
 	<div class="form-group cus"> 
 		<label class="col-sm-4 control-label">Account<span id="required">*</span></label> 
 		<div class="col-sm-6"> <select class="form-control" id="accountName" title = "Select the Account"></select> </div> 
 	</div> 
 	<div class="form-group cus"> 
 		<label class="col-sm-4 control-label">Webproperties<span id="required">*</span> </label>
  		<div class="col-sm-6"> <select class="form-control" id="propName"></select> </div>
    </div>
    <div class="form-group cus"> 
 		<label class="col-sm-4 control-label">Profile<span id="required">*</span></label>
 		 <div class="col-sm-6"> <select class="form-control" id="profName"></select> </div> 
 	 </div> 
 	 <div class="form-group cus"> 
 		<label class="col-sm-4 control-label ">Table Id<span id="required">*</span></label> 
 		<div class="col-sm-6"> <input type="text" class="form-control query" placeholder="Select the Profile Name" id="tabl" required> </div> 
  	</div>
  	 <div class="form-group cus"> 
  	 	<label class="col-sm-4 control-label">Dimension<span id="required">*</span> </label>
  	 	 <div class="col-sm-6"> <input type="text" class="form-control query" placeholder="Ex. ga:visitCount" id='dimension_val' required> </div> 
 	 </div> 
  	 <div class="form-group cus">
  		 <label class="col-sm-4 control-label">Metrics<span id="required">*</span></label> 
  		 <div class="col-sm-6"> <input type="text" class="form-control query" placeholder="Ex. ga:visits" id='metric_value' required> </div>
     </div> 
   	<div class="form-group cus"> 
   		<label class="col-sm-4 control-label">Segment</label> 
   		<div class="col-sm-6"> <input type="text" class="form-control" id="segment" placeholder="Ex. dynamic::ga:country=~India" > </div> 
   	</div> 
   	
   	<div class="form-group cus">
   		 <label class="col-sm-4 control-label">Filter</label>
   		  <div class="col-sm-6"> <input type="text" class="form-control query" id="filter" placeholder="Ex. ga:city==Chennai"> </div> 
   	</div>
    <div class="form-group cus"> 
    	<label class="col-sm-4 control-label">Sort</label> 
   		 <div class="col-sm-6"> <input type="text" class="form-control " id="sort" placeholder="Ex. ga:visits"> </div> 
    </div>
     	<div class="form-group cus"> 
     		<label class="col-sm-4 control-label">Start Date<span id="required">*</span></label>
      		<div class="col-sm-6"> <input type="text" class="form-control datepicker " id="startdate" placeholder="Click & Select Start Date" required> </div>
       	</div> 
       	<div class="form-group cus">
       		 <label class="col-sm-4 control-label">End Date<span id="required">*</span></label> 
       		 <div class="col-sm-6"> <input type="text" class="form-control datepicker " id="enddate" placeholder="Click & Select End Date" required> </div> 
       	</div> 
       
         <div class="form-group cus">
          	  <label class="col-sm-4 control-label">StartIndex</label>
           	 <div class="col-sm-6"> <input type="text" class="form-control" id="startIndex" value=1> </div>
         </div>
          <div class="form-group cus"> 
        	<label class="col-sm-4 control-label">MaxResults</label>
        	 <div class="col-sm-6"><input type="text" class="form-control" id="maxResults" value=100> </div>
          </div> 
            <div class="form-group cus">
        	   <div class="col-sm-4"> <button type="button" class="btn btn-primary" id="saveprofile">Save Profile</button> </div> 
         	   <div class="col-sm-offset-3 col-sm-4"> <button type="button" class="btn btn-info" id="getdata">Get Data</button> </div> 
         	</div>
         	   </fieldset>
           </form> <!-- Form ends -->
        </div>
         
         <!-- User defined list division starts -->
          <div class="col-sm-5">
               <div class="col-sm-9 pull-left" id="userProfile" style="border:0px"><br/>
          	   <div class="col-sm-12 profilemerge" id="profilelists"><b>Userdefined Profile List</b></div>
          	   <div id="getuserprofile" class="profilemerge"></div><br/></div>
          	    
          
          			<div class="col-sm-12 div-align" id="emaildivi" > 
          				<div>
          					<input type="button" value="" id="email" data-toggle="modal" data-target="#myModal"/>          
           					<input type='button' value='' id='download'/>
           					<input type="button" id="lastresult" class="emailHead btn btn-info head-grp" value="Get Last Searched Result">
           					<input type='button' id= "importprofile" class='emailHead btn head-grp' value=' Import Profile ' style=" ">
           					<input type="file" id="uploadid" size="100" accept="application/json" style="display:inline;" >
           				</div>
           			   <div id="vh"></div>
           			</div>
           	<!--                <div id="GetAllUserdiv"> -->
<!--           	 <input type="radio" name="getalluserprofile" id="GetAllUserProfile">GetAllProfiles<br> -->
          	   <input type="button" name="getalluserpro" id="getalluserpro" value="GetallUserProfile"/>
<!--           	   </div> -->
           </div>

                   
            </div> <!-- User defined Query list and Query form div's resides in a row. That row ends-->
               
          	   
             <div class='col-sm-12' id="gaheader"> <!-- Gaheader div starts -->
              <div> 
           		<button type="button" id="showQuery">ShowQuery</button>&nbsp;&nbsp; 
           		<select id="dimension_grp"></select> &nbsp;&nbsp;
           	    <select id="dimension_srh"></select>&nbsp;&nbsp; 
          	    <input type='text' id="dimen_val">&nbsp; 
          	    <button type="button" id="srch_dimen">Search</button> &nbsp;&nbsp;
          	    <input type="checkbox" id="partialsearch" value="PartialSearch">Partial Search
                <select id="noofresult"><option value="0">Select the No rows</option><option value="10">10</option><option value="20">20</option>
                      <option value="50">50</option><option value="100">100</option></select> &nbsp; 
                <button type="button" id="clear_tbl">Clear</button> &nbsp; 
                <button type="button" id="custom" data-toggle="modal" data-target="#myModal1" >Customization</button>
               </div> 
             </div>
           
           
            <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> 
            <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> 
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> 
            <h4 class="modal-title" id="myModalLabel">Email </h4> </div>
             <div class="modal-body"> 
            <form class='form-horizontal' role='form'> <div class='form-group cus'> <label class="col-sm-2 control-label">From</label>
             <div class="col-sm-6"><input type="text" class="form-control" id="fromEmail" value='<%= session.getAttribute("SESSION_USEREMAILID") %>' disabled></div> 
             </div> 
             <div class='form-group '> <label class="col-sm-2 control-label">To</label> 
             <div class="col-sm-6"><input type="email" class="form-control" id="toEmail"></div> </div> 
             <div class='form-group '> <label class="col-sm-2 control-label">Subject</label> 
             <div class="col-sm-6"><input type="text" class="form-control" id="subject"></div> </div> 
             <div class='form-group'> <label class="col-sm-2 control-label">Attachment</label> 
             <div class="col-sm-6"> <select id='attach-id' class='form-control col-sm-5'></select></div> </div>
              <div class='form-group '> <label class="col-sm-2 control-label">frequency</label> 
              <div class="col-sm-4" id="dateselect"> <select class="form-control col-sm-5" id="freq">
               <option value=0>Once</option> <option value=1>Daily</option> <option value=2>Weekly</option> <option value=3>Monthly</option> </select> </div> 
               <div class="col-sm-4" id="secondselect"> <select id='weekdays' class='form-control col-sm-5'></select></div> </div> </form> </div> 
               <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="emailschedule" >Send</button> </div> </div> </div> </div> <br/><br/>
                <div class="modal fade" id="myModal1" tabindex="-1" role="dialog" aria-labelledby="myModalLabel1" aria-hidden="true"> 
            <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> 
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> 
            <h4 class="modal-title" id="myModalLabel1">Customization </h4> </div>
             <div class="modal-body"> 
            <form class='form-horizontal' role='form' id="custom-form">
            
             </form> </div> 
               <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="customSave" >Save</button> </div> </div> </div> </div>
                <div><p id="totalcountrep"></p></div> <div id="tablechart"> </div> 
     
     
</body>
</html>