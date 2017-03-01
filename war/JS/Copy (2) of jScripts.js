/**
 * 
 */



	var queryString;
	var dataTable ;	
	var profileName;
    var div_id;
    var applyId;
    var deleteId;
    var exportId;
    var shareId;
    var JSONDATA;
    var profileindex;
      

  

   
  $(function()
		    { 
	  $.notify.addStyle('happblue', {
		  html: "<div><span data-notify-text/></div>",
		  classes: {
		    base: {		      
		      "background-color":"rgb(248, 252, 218)",
		      "padding": "10px",
		      "word-wrap": "break-word",
		    	  "autoHide": "true",
		    	  "clickToHide": "true",
		    	  "autoHideDelay": "5000"
		    }
		    
		  }
		});
	  
	  $('#emailId').hide();
	  $('#sendEmail').hide(); 
	  $('#gaheader').hide();
	  $('#weekdays').hide();
	  $('#uploadid').hide();
	  $('#getuserprofile').accordion();
	  	/**
		 * display userlist profile
		 */			
			$.ajax({
				type:"POST",
				url:'/getuserlist',
				contentType:'application/json'
			}).done(function(msg){
				//console.log(msg);
				localStorage.removeItem('userlist');
				if(msg!="" && msg!=undefined && msg!=null)
				appendtoprofilelist(msg);
				else
					$('#profilelists').notify( "No Profile Found","info",  { position:"bottom" } );
					
				
			}).fail(function(msg){console.log("error"+msg)});
//		});	
	  
	  /** Sending the Email
	   * Param QueryString (EmailId added)
	   * retrun success message
	   *  */		
	// scheduled email
			$('#emailschedule').click(function(){	 
				
				
				//console.log('check point for email');
				var emailProfile = {};
				emailProfile.fromAddress = document.getElementById('fromEmail').value;
				emailProfile.toAddress = document.getElementById('toEmail').value;	
				emailProfile.subject = document.getElementById('subject').value;
				var sel_opt =  document.getElementById('freq').selectedIndex;
				//console.log(sel_opt);
				emailProfile.frequent = sel_opt;
				emailProfile.subfreq = document.getElementById('weekdays').selectedIndex;
				if($('#attach-id').val() == -1)
					alert("Select the attchment profile");
				else{
					emailProfile.queryId = $('#attach-id').val();
					if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test($('#toEmail').val())){						
							$('#myModal').modal('hide');
							if(sel_opt >= 1)
								emailrequest('/scheduleemail',emailProfile);					
							else{
								//console.log("regular mail");
								 // queryString.emailId = $('#toEmail').val();
								  var temp1= JSON.parse(localStorage.getItem('userlist'));
								  
								  var attachid = $('#attach-id').val();
								  emailProfile.queryId =  temp1[attachid]
								  console.log(JSON.stringify(emailProfile));
								  emailrequest('/emailRequest',emailProfile);
							}
					}
					else{
						 alert("e-mail address not valid format"); 
					}					
				}
			});
			
			
		function emailrequest(urlvalue,queryString){
			$.ajax({
				  type: "POST",
				  url: urlvalue,
				  contentType: "application/json",
				  dataType: "json",					 
				  data: JSON.stringify(queryString)				  	  
			  })
			  .done(function(msg){				
				  alert(msg.status);
			  });
		}	
			
	// call schedule email
		document.getElementById('custom').onclick = function customprofilesave(){
			if(profileindex != null ){
				var tempobj = JSON.parse(localStorage.getItem('userlist'));
				var temp1 = tempobj[profileindex];
				var dimension = queryString.dimensions.split(',');
				var metrics = queryString.metrics.split(',');
				var loopvalue = dimension.concat(metrics) ;
				var cust_value = loopvalue;
				var customprofile;
				var customvalue = [];
				var cust_dimen =[];
				var cust_metr = [];
				$('#custom-form').empty();
				if(temp1.customDimensions && temp1.customMetrics){
					cust_value = temp1.customDimensions.split(',');
					cust_value = cust_value.concat(temp1.customMetrics.split(','));
					console.log(cust_value);
				}
				for(var index in loopvalue){
					$('<div class="form-group"><label class="col-sm-4 control-label">'+loopvalue[index]+'</label><div class="col-sm-6"><input type="text" class="form-control" value="'+cust_value[index]+'" id="cust_'+index+'"></div></div> ').appendTo($('#custom-form'));
				}
				
				document.getElementById('customSave').onclick = function (){				
					console.log("custom save");
					for(var i = 0;i<loopvalue.length;i++){					
						if(i<=dimension.length-1)
							cust_dimen.push($('#cust_'+i).val());
						else
							cust_metr.push($('#cust_'+i).val());
						customvalue [i+1] = $('#cust_'+i).val() 
						console.log("custom dimension: "+ cust_dimen +"    custom Metrics: "+ cust_metr);						
					}
					$('.header').each(function(index){
						if(index > 0){						
								$(this).text(customvalue[index].toString() == "" ?  $(this).text() : customvalue[index].toString() );
						}
						customprofile = {};
						customprofile.dimensions = cust_dimen.toString();
						customprofile.metrics = cust_metr.toString();
						customprofile.userid = $('#emailInfo').text().trim();
						customprofile.queryId_index = profileindex.toString();
							
							temp1.customDimensions = cust_dimen.toString();
							temp1.customMetrics = cust_metr.toString();
							tempobj[profileindex] = temp1;
							localStorage.setItem('userlist',JSON.stringify(tempobj));
							var columnhead = JSONDATA.columnHeaders;
							appendCustomheader(cust_dimen.toString(),cust_metr.toString(),columnhead);
							$.ajax({
								url:'/addcustomdimension',
								type: 'POST',
								data :  JSON.stringify(customprofile),
								dataType : 'json',
								contentType : 'application/json'
							}).done(function(response){								
								console.info(response);								
							}).fail(function(){								
							});						
												
						console.log($(this).text());
						});
					$('#myModal1').modal('hide');
				}
				
			}else{
				var isStore = confirm("Saved profile only customizable. You want this profile?");
				if(isStore == true){
					saveprofile();
					customprofilesave();
				}
			}
		}			
			
			/**
			 * Weekdays and MonthDays select
			 */
			 $('#freq').change(function(){
				    var index=$('#freq option:selected').index();
				    
				    if(index==2){
				     // console.log("gi");
				      var daysname = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				      $('#weekdays').show();
				     $('#weekdays').empty();      
				     
				       $('<option>').val(-1).text("Select days").appendTo('#weekdays');
				      for(var i=0;i<7;i++)        $('<option>').val(i).text(daysname[i]).appendTo('#weekdays');
				      
				    }
				    else if(index==3){
				     $('#weekdays').show();
				      $('#weekdays').empty();       
				       $('<option>').val(-1).text("Select days").appendTo('#weekdays');
				      for(var j=1;j<29;j++)        $('<option>').val(j).text(j).appendTo('#weekdays');
				$('<option>').val(29).text('Last Day').appendTo('#weekdays');      
				    }
				    else
				         $('#weekdays').hide();				      
				  });
			
	  /**
	   * Loading the Email Attachment
	   */
	  $('#email').click(function(){		  
		  var attach = JSON.parse(localStorage.getItem('userlist'));
			$('#attach-id').empty();
			for(var key in attach){
				$('<option value="'+key+'">'+attach[key].profileName+'</option>').prependTo($('#attach-id'));
			}
			$('<option value="-1">Select the attachment </option>').prependTo($('#attach-id'));
	  });
	  
	  /** Ajax for GetAccount Infomation on PageLoad
		* Start Ajax for GetAccount Info on PageLoad  
		*/  
	
	  if(!localStorage.getItem("AccountDetails")){
		  $.ajax({
          	type:"GET",
          	url:"/getAccountInfo",
          	contentType: "application/json"          	
          })
           .done(function(msg){          
          	 localStorage.setItem("AccountDetails",msg);
          	loadAccountsDetails(msg);         	          	 
           }); 		  
	  }
	  else{
		  var acc_details= localStorage.getItem("AccountDetails");
		  loadAccountsDetails(acc_details);
	  }
	  
	  /** 
	   * Loading Account details
	   */
         function loadAccountsDetails(data){
        	 if(!data){
          		 $('#accountName').append("<option value='0'>No account found</option>"); 
          	 }else{
          		var json = jQuery.parseJSON(data); 
          		var accountName = [];             	 
             	 accountName = json                   
                  $('#accountName').empty();  
                  $('#propName').empty(); 
                  $('#tabl').empty();   
                 var account_opt = " <option value=0>Select AccountName</option>";
                  for(var index in accountName){                 	 
                 	 account_opt += "<option value='"+index+"'>"+accountName[index]+"</option>";                  
                  }
                  $('#accountName').append( account_opt);  
          	 }
         }      
 
                
         /** 
          * Get the Properties detail of coressponding Account
 			Start       */         
                $('#accountName').change(function(){
                	$('body').css('cursor','wait');               
                	var acc_detail = {};              	
                	acc_detail.accountid = $('#accountName option:selected').val(); 
                    var acc_data = JSON.stringify(acc_detail);                	
                	$('#propName').empty();               
                	if(!localStorage.getItem(acc_data)){                		
                       ajaxmethod("/getPropertyInfo",acc_data,'propName',acc_data);
                	}else{
                		var prop_details= localStorage.getItem(acc_data);
                		displayproperties(prop_details,'propName');
                	}
                	
                });
                /**
                 * AjaxMethod for Properties and profile
                 */
                function ajaxmethod(urlvalue,acc_detail,propName,acc_data){
                	$.ajax({
                		type:"POST",
                		url:urlvalue,    
                		dataType: "json",
                		data:acc_detail,
                		contentType: "application/json"                		
                	})
                	.done(function(msg){     
                		var data = JSON.stringify(msg);
                		localStorage.setItem(acc_data,data);
                		displayproperties(data,propName);                	
                	});
                } 
                
                /**
                 * Load the Webproperties details Selectbox
                 */
                function displayproperties(data,propName){
                	$property = propName;
                	$('body').css('cursor','default');            	
            		var json_prop = JSON.parse(data);            		
            		properties = json_prop; 
            		var prop_opt = "<option value=0>Select Properties</option>";
            		for( var index in properties){
            			prop_opt +="<option value='"+index+"'>" + properties[index] + "</option>";            		
            		}
            		$('#'+$property).append(prop_opt);
                }
    /**
     * Getting the profile Infomation from Servlet
     * Sending the WebProperties Information
     */            
                //properties change event
                $('#propName').change(function(){
                	$('body').css('cursor','wait');
                	var properties_data = {AccountId:$('#accountName option:selected').val(),PropertiesID:$('#propName option:selected').val()};               	
                	properties_data =  JSON.stringify(properties_data);           
                	$("#profName").empty();                	
              
                	if(!localStorage.getItem(properties_data)){
                		 ajaxmethod("/getProfileInfo",properties_data,"profName",properties_data);                		
                	}else{
                		displayproperties(localStorage.getItem(properties_data),"profName");
                	}                	
                });                
       /**
        * Getting the ProfileId Information
        */         
                //start to get profile Id
                $('#profName').change(function(){
                	$('#tabl').val("ga:"+$('#profName option:selected').val());
                });
	  
	            $( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd',maxDate: '+0D' });
	            
	            
	   /**
	    * save profile
	    */
	      	  
	      	  $('#saveprofile').click(function(){
	      		  saveprofile();
	      	  });       
	            
        /**
         * Get the G Data from Servelt
         * Complusary Param tableid,metrics,startdate,enddate
         * retrun the GData Result
         */
	            
				$('#getdata').click(function()
				{  
					$('body').css('cursor','wait');	
					if(getQueryString()){					    
						if(queryString.dimensions.substring(0,3) =="ga:" || queryString.metrics.substring(0,3) =="ga:"  || queryString.filter.substring(0,3) =="ga:"  || queryString.sort.substring(0,3) =="ga:" )
							{							
							if(queryString.dimensions.split(',').length < 8 || queryString.dimensions.split(',').length < 8){
										$.ajax(
							    		  {
							       			 type : 'POST',
							        		 url : '/getdataAjax',
							        		 dataType : 'json',
							        		 async :true,
							        		 contentType: "application/json",
							       		     data : JSON.stringify(queryString)							       		  
							     		  })
										.done(function (gdata) 
							    		  { 
											JSONDATA = gdata;											
											if(profileindex){
												var tempobj = JSON.parse(localStorage.getItem('userlist'))[profileindex];
												var columnheader = JSONDATA.columnHeaders;
												appendCustomheader(tempobj.customDimensions,tempobj.customMetrics,columnheader);
												}											
											displayTable(JSONDATA);
											gdata = null;
											dimensionadd(queryString.dimensions,document.getElementById('dimension_grp'),"Select Primary Dimension for group");
											dimensionadd(queryString.dimensions,document.getElementById('dimension_srh'),"Select Dimension for Search");
							      		  })
							      		  .fail(function (msg){
							      			$('#totalcountrep').text('');
							      			 						      		
							      			$('body').css('cursor','default');							      		
							      			 if(msg.responseText.substring(0,3) == '400'){
							      				  errormsgDisplay(JSON.stringify(msg.responseText));
								      			  
							      			 }
							      			 else if(msg.responseText.substring(0,3) == '403'){	
							      				  errormsgDisplay(JSON.stringify(msg.responseText));
								      			  
							      			 }
							      			 else if(msg.responseText.substring(0,3) == '401'){
							      				$('#tablechart').html("Your Credentials expired Please Login <a href='/googleLogin'>Click Here</a>");
							      			 }
							      			 
							      			 else{
							      				$('#tablechart').html("Error:  "+msg.responseText);
							      			 }
								});
								
							}else{								
								$('#tablechart').html("Error: you requested "+queryString.dimensions.split(',').length+" dimensions and "+queryString.metrics.split(',').length+" metrics. Maximum 7 dimensions, 7 metrics are allowed");
							}		  
							}else{
								alert("The field start with ga:")
							}
					}
					$('#showQuery').text("ShowQuery");
				});
   /**
    * display the query
    * 
    */				
	$('#showQuery').click(function(){
		if($('#showQuery').text() =="ShowQuery"){
			$('#formvalues').show();
			$('#userProfile').show();
			$('#showQuery').text("HideQuery");
		}
		else if($('#showQuery').text() == "HideQuery"){
			$('#formvalues').hide();
			$('#userProfile').hide();
			$('#showQuery').text("ShowQuery");
		}
		});			
	
	/**
	 * Get last search result
	 */
	$('#lastresult').click(function(){		
		
		$.ajax( {
			type:"GET",
			url:'/getlastsearch',
		    dataType:'json',
		    contentType: 'application/json',
		    data:'emailId='+ $('#emailInfo').text().trim()
			
		})
		.done(function(data){			
				displayTable(data);
		})
		.fail(function(data){
			if(data.responseText == "")
				$('#lastresult').notify("no last result found","info",{ position:'left'});			
		});
	});	
	
	/**
	 * Downaload the CSV File Data
	 * Using JsonInformation from Servlet
	 */			
					$('#download').click(function(){
						if(JSONDATA){
							csvDownload(JSONDATA,"Report");
						}
						else{
							alert("No data found for csv download");
						}						
					});
					
					/**
					 * clearing the grouping value
					 */
					document.getElementById('clear_tbl').onclick = function(){
						$('#dimen_val').val("");
						if(JSONDATA)
							generateTable(JSONDATA,null);
							
					};
					
		/**
		 * No of rows to display
		 */			
					document.getElementById('noofresult').onchange = function(){
						var range = this.value;
						//console.log(range);
						generateTable(JSONDATA,range);						
					}
					
	 /**Dimension list
	  * 
	  */
					document.getElementById('dimension_grp').onchange = function(){
				
						var tempobj = {};
						var jsonobj={};
						var rows_value ={};
						var obj_index = 0;
						var column_header=[];
						var temp_col ={};
						var t_idx=0;
						var select_val = this.options[this.selectedIndex].innerHTML;
						var index =this.length-1;
						var s_index = this.value;
					    console.log(JSONDATA);
						temp_col['name'] = JSONDATA.columnHeaders[s_index].name;					
						column_header[t_idx++]=temp_col;
						temp_col = {};											
						for(var k=index;k<JSONDATA.columnHeaders.length;k++){
							temp_col['name'] = JSONDATA.columnHeaders[k].name;					
							column_header[t_idx++]=temp_col;					
							temp_col = {};	
						}
						for(var i=0,j;j=JSONDATA.rows[i];++i)
							{
								if(tempobj[j[s_index]] || tempobj[j[s_index]] == 0 ){					
									var arr1=[];					
									var pos = tempobj[j[s_index]];					
									var q=1;
									 arr1 = rows_value[pos];
									for(var k=index,l;l=j[k];++k){	
										var tp;
										if(JSONDATA.columnHeaders[k].dataType == 'PERCENT')
										 tp = ((parseInt(arr1[q])+parseInt(l))/i).toString();
										else
										 tp = (parseInt(arr1[q])+parseInt(l)).toString();	
										console.log(tp);
										arr1[q++]=tp;
									}
									rows_value[pos] = arr1;				
								}
								else{						
									var arr=[];					
									var q=0;
									arr[q++] = j[s_index]									
									for(var k=index,l;l=j[k];++k){				
										arr[q++]=l;																			
									}				
									rows_value [obj_index] = arr;
									tempobj[j[s_index]] = obj_index;
									obj_index++;
								}	
							}				
							tempobj=null;							
							jsonobj['columnHeaders']=column_header;
							jsonobj['rows']=rows_value;
							generateTable(jsonobj,null);						
					}					
	//end								
		// Searching the dimension value
		document.getElementById('srch_dimen').onclick = function(){			
			var selectbox = document.getElementById('dimension_srh');
			var dimension_obj;
			var dimension_txt =  document.getElementById('dimen_val').value;
			if(selectbox.value >= 0 && dimension_txt != ''){
				dimension_obj=dimension_txt.trim();				
				dimensionSearch(dimension_obj,document.getElementById('dimension_srh').value,selectbox.length-1);
				
			}else{
				alert('Select the Dimension to search & Enter the search value');
			}
		}
			
		/**
		 * 	clear the Flag	
		 */
		$('.query').change(function(){profileindex=null;console.log("profileindex:" +profileindex)});
			
		
		document.getElementById('uploadid').addEventListener('change', handleFileSelect);
		
		$('#importprofile').click(function(){
			$('#uploadid').toggle();
		});
		    }); 
  
  
  
  function handleFileSelect(evt) {
	    console.log(evt);
	    var files = evt.target.files;
	    var freader = new FileReader();
	     
	      freader.onload = (function(theFile) {
	        return function(e) { 
	        	 try{
	                 var newprofile = JSON.parse(e.target.result);
	                 profileadd(newprofile);
	                 $('#uploadid').hide();
	                 $.notify("Profile Import Success",info);
	               }catch(r){
	                 
	               }
	        };
	      })(files[0]);

	      // Read in the image file as a data URL.
	      console.log('read as string');
	      freader.readAsText(files[0]);
	     
	    
	  }
  
  
  
	//main function end
  function appendCustomheader(dimensions,metrics,columnHeader){
			
		var customheader = JSON.parse(JSON.stringify(columnHeader));				
		var c_dimensions = dimensions;					
		var c_metrics = metrics;					
			if(c_dimensions){
				var cus_dimensions=c_dimensions.split(',');
				cus_dimensions=cus_dimensions.concat(c_metrics.split(','));														
				for(var i=0;i<cus_dimensions.length;i++){															
					//customheader[i].name = cus_dimensions[i] ;
					customheader[i].name = cus_dimensions[i] == "" ? customheader[i].name : cus_dimensions[i];																
				}														
		}
		JSONDATA['customheaders'] = customheader;
	}
  /**
   * Get Ga Query Details
   * @returns {Boolean}
   */
  function getQueryString(){
		queryString = new Object();
		queryString.queryId = $('#tabl').val();
		queryString.dimensions = $('#dimension_val').val();
		queryString.metrics= $('#metric_value').val();
		queryString.segment = $('#segment').val();
		queryString.filter =  $('#filter').val();
		queryString.sort  = $('#sort').val();
		queryString.startDate = $('#startdate').val();
		queryString.endDate = $('#enddate').val();
		queryString.maxResults = $('#maxResults').val();
		queryString.startIndex = $('#startIndex').val();
		if(queryString.metrics.lastIndexOf(',')==queryString.metrics.length-1){
			queryString.metrics = queryString.metrics.substring(0,queryString.metrics.length-1);	
		}
		if(queryString.dimensions.lastIndexOf(',')==queryString.dimensions.length-1){
			queryString.dimensions = queryString.dimensions.substring(0,queryString.dimensions.length-1);	
		}	
		if($('#startdate').val() == '' || $('#tabl').val() == '' || $('#dimension_val').val() == '' || $('#metric_value').val() == '' || $('#enddate').val() == '' ){			   
			alert("Please Enter (*) Required feild  value");
			return false;
		}else
			return true;
	}
  
  
  //adding dimension
  function dimensionadd(dimension,select_box,optionvalue){
	  var dimension_arr = dimension.split(',');
	  var selectbox = select_box;	  
	  selectbox.innerHTML = "";	 
	  var option = '<option value="-1">'+optionvalue+'</option>';	  
	  for(var index in dimension_arr)
		  option += '<option value="'+index+'">'+dimension_arr[index]+'</option>';
	  selectbox.innerHTML = option;
  }
		      
	/**
	 * user profile list
	 */
   function appendtoprofilelist(data){	   
	   var parsedata = JSON.parse(data);
		var arrprofile=[];
		var k=0;
		var temp ;
	
		if(localStorage.getItem('userlist') != null){
			temp = localStorage.getItem('userlist');
			temp=temp.substring(0,temp.length-1);	
			localStorage.setItem("userlist",temp.concat(','+data.substring(1)));	
		}
		else
			localStorage.setItem("userlist",data);		
	
		for(var index in parsedata){
			arrprofile[k++]=index;
		}
		
		for(var i=0,j;( j=arrprofile[i] );++i){
	      //  $('<h3>'+JSON.parse(localStorage.getItem('userlist'))[j].profileName+'</h3><div><p>'+JSON.stringify(JSON.parse(localStorage.getItem('userlist'))[j])+'</p></div>').prependTo($('#getuserprofile'));
			$('<div id='+j+'><input type="radio" name="userProfile" id="usrProf" value="'+j+'"><label>'+JSON.parse(localStorage.getItem('userlist'))[j].profileName+'</label>&nbsp;&nbsp;</div>').prependTo($('#getuserprofile'));
		}
		
	// radio button selected
		$("input:radio").unbind( 'click' );
		$("input:radio").bind( 'click', function(){
			 var index_p;
			    if(div_id){
			    	document.getElementById(div_id).removeChild(applyId); 
			    	document.getElementById(div_id).removeChild(shareId); 
			    	document.getElementById(div_id).removeChild(deleteId);
			    	document.getElementById(div_id).removeChild(exportId);
			    }			      
			    applyId =  createnodebutton(applyId,'apply','getvalue');
			    deleteId = createnodebutton(deleteId,'delete','deletevalue');
			    exportId = createnodebutton(exportId,'export','exportvalue');
			    shareId = createnodebutton(shareId,'share','sharevalue');
			    div_id=$(this).attr("value");	
			   var jsonObj1 = JSON.parse((localStorage.getItem('userlist')));
			    for(var pos in jsonObj1){			    	
			    	if(pos==$('input:radio:checked').val()){	
			    		index_p=pos;
			    		$('.notifyjs-wrapper').remove();
			    		$.notify("Query: "+JSON.stringify(jsonObj1[pos]),{ style: 'happblue'});		
			    		
			    	}
			    }			    
			  document.getElementById(div_id).appendChild(applyId);    
			  document.getElementById(div_id).appendChild(deleteId);
			  document.getElementById(div_id).appendChild(exportId);
			  document.getElementById(div_id).appendChild(shareId);
			  $('#getvalue').click(function(){			    
			    var json = jsonObj1[index_p];	
			    profileindex = index_p;	
			    $('#tabl').val(json.queryId);
			    $('#dimension_val').val(json.dimensions);
			    $('#metric_value').val(json.metrics);
			    $('#filter').val(json.filter);
			    $('#startdate').val(json.startDate);
			    $('#enddate').val(json.endDate);			    
			  }); 
			  $('#deletevalue').click(function (){
				  var flag= confirm('Are you want to delete the profile ?');
				  if(flag == true){
					  var profile = {};
					  profile.index = index_p;
					  $.ajax({
						  url : '/deleteprofile',
						  type : 'GET',
						  data : profile
						  
					  }).done(function(response){
						  alert(reponse);
					  }).fail(function(){
						  alert(reponse);
					  });
					  delete jsonObj1[index_p];
					  localStorage.setItem('userlist',JSON.stringify(jsonObj1));
					  document.getElementById(index_p).remove();
					  console.log("deleted");
					  div_id = null;
				  }else{
					  console.log('Not delted');
				  }
			  });
			  $('#exportvalue').click(function(){
				  downloadlink(JSON.stringify(jsonObj1[pos]),'json');
				  
			  });
			  $('#sharevalue').click(function(){
				  $('#myModal1').modal('show');
				  $('#myModalLabel1').text("Share Profile");
				  $('#custom-form').empty();
				  $('<div class="form-group"><label class="col-sm-4 control-label">Enter the EmailId:</label><div class="col-sm-6"><input type="text" class="form-control" value="" id="emailid_share"></div></div> ').appendTo($('#custom-form'));
				  $('<h4>Attached profile Name:  '+JSON.parse(localStorage.getItem('userlist'))[index_p].profileName+'</h4>').appendTo($('#custom-form'));
				  $('#customSave').text("Send");
				  $('#customSave').click(function(){
					  var temp= {};
					  temp.toAddress = $('#emailid_share').val();
					  temp.profile = JSON.parse(localStorage.getItem('userlist'))[index_p];
					  $.ajax({
						  
						  url:'/shareprofile',
						  type:'POST',
						  data : JSON.stringify(temp),
					      dataType :'json',
					      contentType : 'application/json'
						  
					  }).done(function(msg){
						  console.log(msg);
						  alert("Shared success");
						  
					  }).fail(function(msg){
						  console.log("failed"+msg);
						  alert("EmailID not in the list,Failed");
					  });
					  $('#myModal1').modal('hide');
				  });
				  
			  });
			});		
   }
   /**
    * Create Dynamic Button
    * @param obj_elem
    * @param value
    * @param id
    * @returns
    */
   function createnodebutton(obj_elem,style,id)
   {
	   obj_elem=document.createElement('input');
	   obj_elem.setAttribute('type','button');
	   obj_elem.setAttribute('class',style);
	   obj_elem.setAttribute('id',id);
	   obj_elem.setAttribute('title',style);
	   return obj_elem;
   }
   
   
   function errormsgDisplay( msg){
	      var jsonmsg=msg;								      
		  jsonmsg=('"'+jsonmsg.substring(jsonmsg.indexOf('{')));	    
		  var tempmsg = JSON.parse(jsonmsg);								      		
		  var errormsg = JSON.parse(tempmsg);								      		
		  $('#tablechart').html("Error:  "+errormsg.message);
   }
   /**
    * dGenerate table
    */
   function generateTable(data,range){
	   	var outputvalue = data; 
		var div = document.getElementById('tablechart');
		div.innerHTML = "";
		var table = document.createElement('table');
		table.setAttribute('border','1');
		table.setAttribute('class','tablesorter');
		table.setAttribute('id','gatable');		
		var thead = document.createElement('thead');
		var col_tr = document.createElement('tr');		
		outputvalue.rows
		if(typeof outputvalue.rows =="undefined" ){
			var th = document.createElement('th');
			var text = document.createTextNode('No result Found');
			th.appendChild(text);
			col_tr.appendChild(th);
			thead.appendChild(col_tr);
			table.appendChild(thead);
			div.appendChild(table);
			$('#totalcountrep').text(" No results found");
		}
		else{
			var text;
			var th;
			 var columnName ;
			th= document.createElement('th');
			text = document.createTextNode('Index\u00A0\u00A0\u00A0\u00A0');
			th.appendChild(text);
			col_tr.appendChild(th);
              if(outputvalue.customheaders)
            	  columnName = outputvalue.customheaders;
              else
            	  columnName = outputvalue.columnHeaders
			for(var i=0,j; j=columnName[i];++i){
				th = document.createElement('th');
				text = document.createTextNode(j.name+'\u00A0\u00A0\u00A0\u00A0\u00A0');
				th.appendChild(text);
				col_tr.appendChild(th);
			}			
			thead.appendChild(col_tr);
			table.appendChild(thead);
			var tbody = document.createElement('tbody');
			var td;
			var tr;
			var text_1;			
           if(range)
        	   for(var k=0, l; (l=outputvalue.rows[k]) && (k<range); ++k){
   				tr = document.createElement('tr');
   				td = document.createElement('td');
   				text_1 = document.createTextNode(k+1);
   				td.appendChild(text_1);
   				tr.appendChild(td);   				
   				for(var m=0, n; n=l[m]; ++m){
   					td = document.createElement('td');
   					text_1 = document.createTextNode(n);                    
   					td.appendChild(text_1);
   					tr.appendChild(td);
   				}
   				tbody.appendChild(tr);
   			}
           else
			for(var k=0, l; l=outputvalue.rows[k]; ++k){
				tr = document.createElement('tr');
				td = document.createElement('td');
				text_1 = document.createTextNode(k+1);
				td.appendChild(text_1);
				tr.appendChild(td);
				for(var m=0, n; n=l[m]; ++m){
					td = document.createElement('td');
					text_1 = document.createTextNode(n);
					td.appendChild(text_1);
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			   table.appendChild(tbody);			  
			   div.appendChild(table);
			   $('#gatable').tablesorter();
			   if(outputvalue.totalResults)
			$('#totalcountrep').text("total no. of results "+outputvalue.rows.length +" / "+outputvalue.totalResults);
		}
   }
   
	/**
	 * display the chart
	 */			
	function displayTable(data){
		generateTable(data,null);
       $('#formvalues').hide();
       $('#userProfile').hide();       
       $('#gaheader').show();
       $('body').css('cursor','default');
       }		
	
	//function dimension search 
	/**
	 * dimension search
	 */
	function dimensionSearch(dimension,index,length){
	//	console.log(dimension+ index + length);
		var temp_obj ={};
		var jsonobj ={};		
		var json_arr =[];
		var temp_col ={};
		var t_idx=0;
		var inc=0;
		var column_header={};
		temp_col = {};											
		for(var k=0;k<JSONDATA.columnHeaders.length;k++){
			temp_col['name'] = JSONDATA.columnHeaders[k].name;	
			column_header[t_idx++]=temp_col;	
			temp_col = {};	
		}		
		for(var i=0,j;j=JSONDATA.rows[i];++i){			
			if(j[index].indexOf(dimension) == 0 ){
				var json_arr =[];
					var obj_index =0;
			   //    json_arr[obj_index++]=dimension;
				   for(var k=0,l;l=j[k];++k){					   
					   if(!json_arr[obj_index])
					   json_arr[obj_index]=0;					  
					 //  var q = parseInt(json_arr[obj_index])+parseInt(l);
					   json_arr[obj_index++]=l					   				   
				   }
				   temp_obj[inc++]=json_arr;
			}
		}
		//console.log(JSON.stringify(temp_obj));
	
		var jsonvalue = {};
		jsonvalue['columnHeaders'] = column_header;
		jsonvalue['rows'] = temp_obj;	
		generateTable(jsonvalue,null);
		jsonvalue = null;
		column_header = null;
		temp_obj =null;
	}
	
	//profile save
	function saveprofile(){ 		
		  
  		if(getQueryString()){
  		  profileName = prompt("Please Enter the profile name","");
  		  if(JSON.parse(localStorage.getItem('userlist'))){
  			  var temp = JSON.parse(localStorage.getItem('userlist'))
  			  for(var key in temp)
  				  if(temp[key].profileName == profileName){  				
  					$('#saveprofile').notify( "Profile Name already there",  { position:"top" });  					
  					 					saveprofile();
  				  }
  				  else{
  					}
  		  }
  		if(profileName != "" && profileName != null){  			
  				queryString.profileName = profileName;  				
  				profileadd(queryString);
  				
  			}	
  		}  
  	  }	
	
   //function start for csv download
   
	
	
	function profileadd(queryString){
		var queryIndex = Math.floor((1 + Math.random()) * 0x10000).toString(16);
			queryString.profileIndex = queryIndex;
		//	console.log(JSON.stringify(queryString));
			$.ajax({
				
				type:'POST',
				url:'/storeprofiledata',
				contentType:"application/json",
				data:JSON.stringify(queryString)
			}).done(function (reponse){
				$('#saveprofile').notify( "Success","info",  { position:"bottom" } 				);
			//	console.log(response);
				
			}).fail(function (response){
				
			});
			
			if(queryString.profileName != undefined){
			var qobj = new Object();
			var tmpobj = new Object();
			var size = 0;
													
			if(localStorage.getItem('userlist')!=null){
				qobj = JSON.parse(localStorage.getItem('userlist'));
									
				qobj[queryString.profileName]=queryString;
			}
			tmpobj[queryIndex]=queryString;
			profileindex = queryIndex;
			queryString.queryIdFlag = queryIndex;
		//	console.log(queryString);		
        appendtoprofilelist(JSON.stringify(tmpobj));		       
		}	
	
	}
	
   /**
    * Creating the CSV File And Download Option
    */
function csvDownload(data,ReportTitle){
  //  console.log(data);
	var jsonData = typeof data != 'object' ? JSON.parse(data) : data ;
	var CSV = '';
	var columnName;
	CSV += ReportTitle + '\r\n\n';	
	if(jsonData.customheaders)
  	  columnName = jsonData.customheaders;
    else
  	  columnName = jsonData.columnHeaders
	for(var a=0,b;b=columnName[a];++a)
		CSV += b.name+',';
	CSV += '\r\n';
	for(var c=0,d;d=jsonData.rows[c];++c){	
		for(var e=0,f;f=d[e];++e)			{
			CSV += (f.indexOf(',') == -1 ? f : f.replace(/\,/g,' ')) +',';				
		}
		CSV = CSV.substring(0,CSV.length-1)	;	
		CSV += '\r\n';
	}	
	downloadlink(CSV,'csv');
}
 function downloadlink(data,dataformat){
	 var link = document.createElement('a');
	 var uri;
	 if(dataformat ==  'json'){
		  uri = 'data:text/json;charset=utf-8,' + escape(data);
		 link.download =  "profile.json";
	 }
	 else if(dataformat ==  'csv'){
		  uri = 'data:text/csv;charset=utf-8,' + escape(data);
		 link.download =  "report.csv";
	 }
		link.href = uri;
		link.style = "visibility:hidden";		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		data = null;
 }  

