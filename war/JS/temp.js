/**
 * 
 */


	var queryString;
	var dataTable ;	
	var profileName;
    var div_id;
    var applyid;
    var deleteid;
    var JSONDATA;
    var profileindex;




    $(function()
		    {
		    	 $('#emailId').hide();
	  			 $('#sendEmail').hide(); 
	             $('#gaheader').hide();
	  			 $('#weekdays').hide();

	  			 $( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd',maxDate: '+0D' });

	  			 $.ajax(
	  			 {
					type:"POST",
					url:'/getuserlist',
					contentType:'application/json'
				  }).done(function(msg)
				  {
				
					localStorage.removeItem('userlist');
					if(msg!="" && msg!=undefined && msg!=null)
					appendtoprofilelist(msg);
					else
					$('#profilelists').notify( "No Profile Found","info",  { position:"bottom" } );
					}).fail(function(msg)
					{
						console.log("error"+msg)
					});

                   // Loading Profile deatails
                     if(!localStorage.getItem("AccountDetails"))
                     {
		  				$.ajax(
		  				{
          					type:"GET",
          					url:"/getAccountInfo",
          					contentType: "application/json"
          	            }).done(function(msg){          
          	 				localStorage.setItem("AccountDetails",msg);
          					accountDisplay(msg);         	
          	 
           				}); 
		             }
	 				 else{
						  var acc_details= localStorage.getItem("AccountDetails");
		 					 accountDisplay(acc_details);
	 					 }

                    /**
                    *  Display the corresponding Webpropertiess for account
                    */
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

                	$('#profName').change(function(){
                		$('#tabl').val("ga:"+$('#profName option:selected').val());
                	});


                	$('#saveprofile').click(function(){
	      		  		saveprofile();
	      	 		 });
                	
                	
                	
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
            											displaychart(JSONDATA);
            											gdata = null;
            											dimensionadd(queryString.dimensions,document.getElementById('dimension_grp'),"Select Primary Dimension for group");
            											dimensionadd(queryString.dimensions,document.getElementById('dimension_srh'),"Select Dimension for Search");
            							      		  })
            							      		  .fail(function (msg){
            							      			$('#totalcountrep').text('');
            							      			  var jsonmsg;
            							      			$('body').css('cursor','default');
            							      			 if(msg.responseText.substring(0,3) == '400'){
            							      	     			  jsonmsg=JSON.stringify(msg.responseText);
            								         			  jsonmsg=('"'+jsonmsg.substring(jsonmsg.indexOf('{')));							      			
            								         			  var tempmsg = JSON.parse(jsonmsg);
            								         			  var errormsg = JSON.parse(tempmsg);
            								         			  $('#tablechart').html("Error:  "+errormsg.message);
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
                	         * Display Query Data fields
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
                						displaychart(data);
                				})
                				.fail(function(data){
                					if(data.responseText == "")
                						$('#lastresult').notify("no last result found","info",{ position:'left'});
                					
                				});
                			});
                			/**
                			 * clear the flag when field changes
                			 */
                			$('.query').change(function(){profileindex=null;console.log("profileindex:" +profileindex)});
                			
                			  /** Sending the Email
                			   * Param QueryString (EmailId added)
                			   * retrun success message
                			   *  */		
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
                							emailProfile.queryId = parseInt($('#attach-id').val());
                							if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test($('#toEmail').val())){
                								if(queryString){
                									$('#myModal').modal('hide');
                									if(sel_opt >= 1)
                										emailrequest('/scheduleemail',emailProfile);					
                									else{
                										  var temp1= JSON.parse(localStorage.getItem('userlist'));
                										  var attachid = parseInt($('#attach-id').val());
                										  emailProfile.queryId =  temp1[attachid]
                										  console.log(JSON.stringify(emailProfile));
                										  emailrequest('/emailRequest',emailProfile);
                									}
                								   }
                							    }
                							    else{
                								 alert("e-mail address not valid format"); 
                							    }
                							}	
                					});
                			       
                			       /**
                			        * Get the Days Details
                			        */
                			       $('#freq').change(function(){
                					    var index=$('#freq option:selected').index();                					    
                					    if(index==2){
                					    	var daysname = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                					    	$('#weekdays').show();
                					    	$('#weekdays').empty();      
                					        $('<option>').val(-1).text("Select days").appendTo('#weekdays');
                					        for(var i=0;i<7;i++)        
                					        	$('<option>').val(i).text(daysname[i]).appendTo('#weekdays');
                					      
                					    }
                					    else if(index==3){
                					    	$('#weekdays').show();
                					    	$('#weekdays').empty();       
                					    	$('<option>').val(-1).text("Select days").appendTo('#weekdays');
                					    	for(var j=1;j<29;j++)        
                					    		$('<option>').val(j).text(j).appendTo('#weekdays');
                					    	$('<option>').val(29).text('Last Day').appendTo('#weekdays');      
                					    }
                					    else
                					         $('#weekdays').hide();
                					      
                					  });
                			       /**
                			        * Adding attahment list
                			        */
                			       $('#email').click(function(){                			 		  
                			 		  var attach = JSON.parse(localStorage.getItem('userlist'));
                			 			$('#attach-id').empty();
                			 			for(var key in attach){
                			 				$('<option value="'+key+'">'+attach[key].profileName+'</option>').prependTo($('#attach-id'));
                			 			}
                			 			$('<option value="-1">Select the attachment </option>').prependTo($('#attach-id'));                			 		  
                			 		  
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
                			   				generateTable(JSONDATA,range);
                			   		}
		    }


		     function accountDisplay(data){
        		 if(!data){
          		 $('#accountName').append("<option value='0'>No account found</option>"); 
          		 }
          		 else{
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
              * Ajax method for loading account details
              * @param urlvalue
              * @param acc_detail
              * @param propName
              * @param acc_data
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
              * Display the WebPrpperties
              * @param data
              * @param propName
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
             * Save the Profile in datastore and localstorage
             */
         	function saveprofile(){
          				  
          		if(getQueryString()){
          			profileName = prompt("Please Enter the profile name","");
          			if(JSON.parse(localStorage.getItem('userlist'))){
          				var temp = JSON.parse(localStorage.getItem('userlist'))
          				for(var key in temp)
          					if(temp[key].profileName == profileName){
          						$('#saveprofile').notify( "Profile Name already there",  { position:"top" } 				);
          						saveprofile();
          					}
          					else{
          					}
          			}
          			if(profileName != "" && profileName != null){
          				queryString.profileName = profileName;
        				
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
        						for(var key in qobj){
        							size++;
        						}
        						
        						qobj[queryString.profileName]=queryString;			
        							
        					}

        					tmpobj[size]=queryString;
        					profileindex = size;
        					queryString.queryIdFlag = size;
        				//	console.log(queryString);
        		
        		        appendtoprofilelist(JSON.stringify(tmpobj));
        		       
        				}
//              			 profileName="";	
          		     }
          		}
          	  }	
         	
         	  function appendCustomheader(dimensions,metrics,columnHeader){
      			
         			var customheader = JSON.parse(JSON.stringify(columnHeader));				
         			var c_dimensions = dimensions;					
         			var c_metrics = metrics;					
         				if(c_dimensions){
         					var cus_dimensions=c_dimensions.split(',');
         					cus_dimensions=cus_dimensions.concat(c_metrics.split(','));														
         					for(var i=0;i<cus_dimensions.length;i++){															
         						customheader[i].name = cus_dimensions[i] ;
         						//customheader[i].name = cus_dimensions[i] == "" ? customheader[i].name : cus_dimensions[i];																
         					}														
         			    }
         			   JSONDATA['customheaders'] = customheader;
         			}
         	  
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
         	 
         	/**
         	 * Loading the dimesion value to Select Box
         	 * @param dimension
         	 * @param select_box
         	 * @param optionvalue
         	 */ 
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
         	 * Adding the Profile List 
         	 * @param data
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
         			$('<div id='+j+'><input type="radio" name="userProfile" id="usrProf" value="'+j+'"><label>'+JSON.parse(localStorage.getItem('userlist'))[j].profileName+'</label>&nbsp;&nbsp;</div>').prependTo($('#getuserprofile'));
         		}
         	// radio button selected
         		$("input:radio").unbind( 'click' );
         		$("input:radio").bind( 'click', function(){
         			 var index_p;        			 
         			    if(div_id){
         			    	document.getElementById(div_id).removeChild(applyid); 
         			    	document.getElementById(div_id).removeChild(deleteid);
         			    }         			      
         			    applyid =  createnodebutton(applyid,'Apply','getvalue');
         			    deleteid = createnodebutton(deleteid,'Delete','deletevalue');         			    
         			    div_id=$(this).attr("value");         	
         			   var jsonObj1 = JSON.parse((localStorage.getItem('userlist')));
         			    for(var pos in jsonObj1){			    	
         			    	if(pos==$('input:radio:checked').val()){         	
         			    		index_p=pos;
         			    		$.notify("Query: "+JSON.stringify(jsonObj1[pos]),"info");         			    		
         			    	}
         			    }         			    
         			  document.getElementById(div_id).appendChild(applyid);    
         			  document.getElementById(div_id).appendChild(deleteid);
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
         			});         		
            }
         	/**
         	 * Create Apply button and delete button
         	 * @param obj_elem
         	 * @param value
         	 * @param id
         	 * @returns
         	 */
         	function createnodebutton(obj_elem,value,id)
            {
         	   obj_elem=document.createElement('input');
         	   obj_elem.setAttribute('type','button');
         	   obj_elem.setAttribute('value',value);
         	   obj_elem.setAttribute('id',id);
         	   return obj_elem;
            }
         	
         	/** 
         	 * Generte table from the GaData
         	 * @param data
         	 * @param range
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
        	function displaychart(data){
        		generateTable(data,null);
               $('#formvalues').hide();
               $('#userProfile').hide();               
               $('#gaheader').show();
               $('body').css('cursor','default');
               }
        	
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
        		var jsonvalue = {};
        		jsonvalue['columnHeaders'] = column_header;
        		jsonvalue['rows'] = temp_obj;
        		generateTable(jsonvalue,null);
        		jsonvalue = null;
        		column_header = null;
        		temp_obj =null;
             }

        	/**
        	 * Customization 
        	 */
    		document.getElementById('custom').onclick = function customprofilesave(){
    			if(profileindex != null ){
    				var dimension = queryString.dimensions.split(',');
    				var metrics = queryString.metrics.split(',');
    				var loopvalue = dimension.concat(metrics) ;
    				var customprofile;
    				var customvalue = [];
    				var cust_dimen =[];
    				var cust_metr = [];
    				$('#custom-form').empty();    				
    				for(var index in loopvalue){
    					$('<div class="form-group"><label class="col-sm-4 control-label">'+loopvalue[index]+'</label><div class="col-sm-6"><input type="text" class="form-control" id="cust_'+index+'"></div></div> ').appendTo($('#custom-form'));
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
    								$(this).text(customvalue[index]);
    						}
    						customprofile = {};
    						customprofile.dimensions = cust_dimen.toString();
    						customprofile.metrics = cust_metr.toString();
    						customprofile.userid = $('#emailInfo').text().trim();
    						customprofile.queryId_index = profileindex.toString();
    							var tempobj = JSON.parse(localStorage.getItem('userlist'));
    							var temp1 = tempobj[profileindex];
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
        	 * Email Request
        	 * @param urlvalue
        	 * @param queryString
        	 */
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
    											var tp = (parseInt(arr1[q])+parseInt(l)).toString();    						
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
        	 * CSV Data Generate and Download
        	 * @param data
        	 * @param ReportTitle
        	 */
        	function csvDownload(data,ReportTitle){
        	  //  console.log(data);
        		var jsonData = typeof data != 'object' ? JSON.parse(data) : data ;
        		var CSV = '';
        		CSV += ReportTitle + '\r\n\n';		
        		for(var a=0,b;b=jsonData.columnHeaders[a];++a)
        			CSV += b.name+',';
        		CSV += '\r\n';
        		for(var c=0,d;d=jsonData.rows[c];++c){	
        			for(var e=0,f;f=d[e];++e)			{
        				CSV += (f.indexOf(',') == -1 ? f : f.replace(/\,/g,' ')) +',';				
        			}        					
        			CSV += '\r\n';
        		}	
        		var fileName = ReportTitle;
        		var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);;
        		var link = document.createElement('a');
        		link.href = uri;
        		link.style = "visibility:hidden";
        		link.download = fileName + ".csv";
        		document.body.appendChild(link);
        		link.click();
        		document.body.removeChild(link);
        		CSV = null;
        	}
        	   

