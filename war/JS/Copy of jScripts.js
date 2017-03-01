/**
 * 
 */


    var dataType =[];
    var columnType = [];
    var columnName = [];
    var rowsValue = new Array();
    var tablestr = '';
    var accountName = [];
    var accountId = [];
    var profileId= [];
    var propName;
    var profName;
    var loc;
    var chartData=[];
    var tbl_id,endDate,startDate;
	var dimension;
	var metrics;
	var data;
	var queryString;
	var filter;
	var segment;
	var sort;
	var maxResults;
	var dataTable ;
	var flag;
	var profileName;
    var div_id;
    var node;
    var JSONDATA;
      
   // load the Google Visualization api for chart  
  

   
  $(function()
		    { 
	  
	  $('#emailId').hide();
	  $('#sendEmail').hide(); 
	  $('#gaheader').hide();
	  $('#weekdays').hide();
	  /**
		 * display userlist profile
		 */
//		$('#getuserprofile').click(function(){
			console.log("list profile");
			
			$.ajax({
				type:"POST",
				url:'/getuserlist',
				contentType:'application/json'
			}).done(function(msg){
				console.log(msg);
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
				console.log('check point for email');
				if(queryDetails){
					
				}
				
			});
			 $('#freq').change(function(){
				    var index=$('#freq option:selected').index();
				    
				    if(index==2){
				      console.log("gi");
				      var daysname = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
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
			
	 //		
	  //email start point
	  $('#email').click(function(){
		  
		  
		  $('#emailId').show();
		  $('#sendEmail').show();
		  
	  });
	  
	  $('#sendEmail').click(function(){
		  if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test($('#emailId').val()))
		  {
			  console.log("Email ready to send");
			  console.log(queryString);
			  if(queryString != null){
				  queryString.emailId = $('#emailId').val();
				  console.log(queryString);
				  console.log(typeof queryString)
				  $.ajax({
					  type: "POST",
					  url: "/emailRequest",
					  contentType: "application/json",
					  dataType: "json",					 
					  data: JSON.stringify(queryString)
					  	  
				  })
				  .done(function(msg){
					  console.log(msg.status);
					  alert(msg.status);
					  $('#emailId').hide();
					  $('#sendEmail').hide();
					  
				  });
			  }
			  else{
				  alert("Attachment Data is empty");
			  }
		  }
		  else{
		    alert("e-mail address not valid format");  
		    }
		  
			  
		  
		  
		  
	  });
	  
	  
	  //email end point
	  
	 
	  
	  
/** Ajax for GetAccount Infomation on PageLoad
Start Ajax for GetAccount Info on PageLoad  */
	  
	  console.log(!localStorage.getItem("AccountDetails"));
	  if(!localStorage.getItem("AccountDetails")){
		  $.ajax({
          	type:"GET",
          	url:"/getAccountInfo",
          	contentType: "application/json"
          	
          })
           .done(function(msg){
          	 console.log("Msessage"+msg);
          	 console.log(typeof msg);
          	 localStorage.setItem("AccountDetails",msg);
          	accountDisplay(msg);         	
          	 
           }); 
		  
	  }
	  else{
		  var acc_details= localStorage.getItem("AccountDetails");
		  accountDisplay(acc_details);
	  }
         function accountDisplay(data){
        	 if(!data){
          		 $('#accountName').append("<option value='0'>No account found</option>"); 
          	 }else{
          		var json = jQuery.parseJSON(data);                	 
         		 console.log(json);
         		 var accountName = [];
             	 
             	 accountName = json   
                 console.log(accountName);
            
                  
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
 /** End Ajax for GetAccount Info on PageLoad   */
                
 /** 
  * Get the Properties detail of coressponding Account
 Start       */         
                $('#accountName').change(function(){
                	$('body').css('cursor','wait');
                	console.log("opertion property"+$('#accountName option:selected').val());
                	var acc_detail = {};                	
                	var acc_data = $('#accountName option:selected').val(); 
                	acc_detail.accountid = acc_data;
                	console.log(typeof acc_detail + acc_detail);
                	var propeties =[];
                	$('#propName').empty();  
                	console.log(!localStorage.getItem(acc_data));
                	if(!localStorage.getItem(acc_data)){
                		console.log("from server");
                		$.ajax({
                    		type:"POST",
                    		url:"/getPropertyInfo",    
                    		dataType: "json",
                    		data:  JSON.stringify(acc_detail),
                    		contentType: "application/json"
                    		
                    	})
                    	.done(function(msg){
                    		console.log(msg);
                    		var data = JSON.stringify(msg);
                    		localStorage.setItem(acc_data,data);
                    		displayproperties(data);
                    	});
                	}else{
                		var prop_details= localStorage.getItem(acc_data);
                		displayproperties(prop_details);
                	}
                	
                });
                
                function displayproperties(data){
                	$('body').css('cursor','default');
            		console.log(JSON.parse(data));          		
            		
            		var json_prop = JSON.parse(data);
            		console.log(json_prop);
            		properties = json_prop; 
            		var prop_opt = "<option value=0>Select Properties</option>";
            		for( var index in properties){
            			prop_opt +="<option value='"+index+"'>" + properties[index] + "</option>";
            			console.log(index);
            		}
            		$('#propName').append(prop_opt);
                }
                
                // account change end
    /**
     * Getting the profile Infomation from Servlet
     * Sending the WebProperties Information
     */            
                //properties change event
                $('#propName').change(function(){
                	$('body').css('cursor','wait');
                	console.log("opertion property"+$('#accountName option:selected').val());
                	console.log("opertion property"+$('#propName option:selected').val());
                	var properties_data = {AccountId:$('#accountName option:selected').val(),PropertiesID:$('#propName option:selected').val()};               	
                	properties_data = JSON.stringify(properties_data);
                	console.log(properties_data);
                	$("#profName").empty();
                	var profileInfo =[];
                	console.log(!localStorage.getItem(properties_data));
                	if(!localStorage.getItem(properties_data)){
                		$.ajax({
                    		type:"POST",
                    		url:"/getProfileInfo",   
                    		dataType: "json",
                    		contentType : "application/json",	
                    		data: properties_data
                    		
                    	})
                    	.done(function(msg){
                    		var p_data = JSON.stringify(msg);
                    		localStorage.setItem(properties_data,p_data);
                    		displayprofile(p_data);
                    		//$('#tabl').val("ga:"+$('#profName').val());
                    		
                    	});
                	}else{
                		console.log(localStorage.getItem(properties_data));
                		displayprofile(localStorage.getItem(properties_data));
                	}
                	
                });
                
                function displayprofile(profiledata){
                	$('body').css('cursor','default');
            		console.log(profiledata);
            		var json_prof = JSON.parse(profiledata);
            		console.log(json_prof);
            		profileInfo = json_prof;
            		var prof_opt= "<option value=0>Select ProfileName</option>";
            		for( var index in  profileInfo){
            			prof_opt += "<option value='" + index + "'>" + profileInfo[index] + "</option>";
            		}
            		$("#profName").append(prof_opt);
                	
                }
                //end properties changes
                
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
	      	  
	      	  $('#saveprofile').click(function saveprofile(){
	      		  console.log("porfile saved");
	      		  flag = 1
	      		  profileName = prompt("Please Enter the profile name","");
	      		  if(JSON.parse(localStorage.getItem('userlist'))){
	      			  var temp = JSON.parse(localStorage.getItem('userlist'))
	      			  for(var key in temp)
	      				  if(temp[key].profileName == profileName){
	      					  console.log("key details "+key+""+temp[key].profileName);
	      					$('#saveprofile').notify( "Profile Name already there",  { position:"top" } 				);
	      					saveprofile();
	      				  }
	      				  else{
	      					}
	      		  }
	      		if(profileName != "" && profileName != null)
			      		$('#saveprofile').notify( "Profile will be save on next request","info",  { position:"bottom" } 				);
				  
	      		  console.log(profileName);
	      		  
	      	  });       
	            
        /**
         * Get the G Data from Servelt
         * Complusary Param tableid,metrics,startdate,enddate
         * retrun the GData Result
         */
	            
				$('#getdata').click(function()
				{  
					$('body').css('cursor','wait');	
					var date_1 = new Date();
					tbl_id = $('#tabl').val();
					dimension = $('#dimension_val').val();
					metrics = $('#metric_value').val();
					segment = $('#segment').val();
					filter =  $('#filter').val();
					sort = $('#sort').val();
					startDate = $('#startdate').val();
					endDate = $('#enddate').val();
					maxResults = $('#maxResults').val();
					console.log(metrics.lastIndexOf(','));
					console.log(metrics.length-1);
					if(metrics.lastIndexOf(',')==metrics.length-1){
						metrics = metrics.substring(0,metrics.length-1);
						console.log(metrics);
					}
					if(dimension.lastIndexOf(',')==dimension.length-1){
						dimension = dimension.substring(0,dimension.length-1);
						console.log(dimension);
					}
					queryString = new Object();
					queryString.queryId = tbl_id;
					queryString.metrics = metrics;
					queryString.dimensions = dimension;
					queryString.startDate = startDate;
					queryString.endDate = endDate;
					queryString.filter = filter;
					queryString.segment = segment;
					queryString.sort = sort;
					queryString.maxResults = maxResults;
					if(profileName != "" && profileName != null)
					queryString.profileName = profileName;
					profileName="";	
					//	'{"tableid":"'+tbl_id + '","metrics":"' + metrics + '","dimension":"' + dimension + '","startDate":"' + startDate + '","endDate":"' + endDate
					//+ '","filter":"'+filter+'","segment":"'+segment+'","sort":"'+sort+'"}' ;
					console.log(queryString);
					localStorage.setItem($('#emailInfo').text().trim()+','+date_1.getTime(),JSON.stringify(queryString));
					
					
					if($('#startdate').val() == '' || $('#tabl').val() == ''  || $('#metric_value').val() == '' || $('#enddate').val() == '' ){
					   
						alert("Please Enter (*) Required feild  value");
						
					}else{
					      //if()
						console.log(dimension.substring(0,3));
						if(dimension.substring(0,3) =="ga:" || metrics.substring(0,3) =="ga:"  || filter.substring(0,3) =="ga:"  || sort.substring(0,3) =="ga:" )
							{
							//ajax started
							//console.log("dimension size:"+dimension.split(',').length);
							if(dimension.split(',').length < 8 || dimension.split(',').length < 8){
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
											displaychart(gdata);	
											JSONDATA = gdata;
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
												console.log('size vale:'+size);
												tmpobj[size]=queryString;		
												console.log("user obj "+tmpobj);
									        appendtoprofilelist(JSON.stringify(tmpobj));
											}
											
											dimensionadd(queryString.dimensions);
							      		  })
							      		  .fail(function (msg){
							      			$('#totalcountrep').text('');
							      			  var jsonmsg;
							      			  console.log(msg);
							      			$('body').css('cursor','default');
							      			  console.log(msg.responseText);
							      			 if(msg.responseText.substring(0,3) == '400'){
							      				console.log(typeof msg.responseText);
								      			  jsonmsg=JSON.stringify(msg.responseText);
								      			  console.log(jsonmsg);
								      			  jsonmsg=('"'+jsonmsg.substring(jsonmsg.indexOf('{')));							      			
								      			  console.log(jsonmsg + typeof jsonmsg);
								      			  var tempmsg = JSON.parse(jsonmsg);
								      			  console.log(tempmsg + typeof tempmsg);
								      			  var errormsg = JSON.parse(tempmsg);
								      			  console.log(errormsg);
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
								
								$('#tablechart').html("Error: you requested "+dimension.split(',').length+" dimensions and "+metrics.split(',').length+" metrics. Maximum 7 dimensions, 7 metrics are allowed");
							}
							
						    		  
							}else{
								alert("The field start with ga:")
							}					
						
						//end ajax
					}
					
					
					
				});
				
   /**
    * display the query
    * 
    */				
	$('#showQuery').click(function(){
		$('#formvalues').show();
		$('#userProfile').show();
		$('#gaheader').hide();
		});			
	
	/**
	 * Get last search result
	 */
	$('#lastresult').click(function(){
		alert("hi you want last search results");	
		
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
			console.log(data);
			console.log("responsetext"+data.responseText);
			if(data.responseText == "")
				$('#lastresult').notify("no last result found","info",{ position:'left'});
			
		});
	});
	
	
	/**
	 * Downaload the CSV File Data
	 * Using JsonInformation from Servlet
	 */			
					$('#download').click(function(){
						if(!(typeof dataTable)){
							csvDownload(JSON.parse(JSON.stringify(dataTable)),"Report");
						}
						else{
							alert("No data found for csv download");
						}						
					});
	 /**Dimension list
	  * 
	  */
					document.getElementById('dimension_grp').onchange = function(){
						console.log("hi select box"+this.value+this.options[this.selectedIndex].innerHTML);
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
						console.log(this.length-1);
						console.log(tempobj);
						console.log(rows_value);
						temp_col['name'] = JSONDATA.columnHeaders[s_index].name;
						console.log("first index: "+JSONDATA.columnHeaders[s_index].name)
						console.log(temp_col);
						column_header[t_idx++]=temp_col;
						temp_col = {};
						console.log(JSON.stringify(column_header)+":"+t_idx);
						
						for(var k=index;k<JSONDATA.columnHeaders.length;k++){
							temp_col['name'] = JSONDATA.columnHeaders[k].name;
							console.log("colname:"+JSONDATA.columnHeaders[k].name+": OBJ: "+temp_col+" :INDEX: " +t_idx+"valeu: "+temp_col+"col_header value"+JSON.stringify(column_header));
							column_header[t_idx++]=temp_col;
							console.log(JSON.stringify(temp_col)+"col value: "+ JSON.stringify(column_header));
							temp_col = {};	
						}
						for(var i=0,j;j=JSONDATA.rows[i];++i)
							{
								if(tempobj[j[s_index]] || tempobj[j[s_index]] == 0 ){
									console.log("Index value: "+ j[s_index]+ "Object value: "+tempobj[j[s_index]]);
									var arr1=[];
									console.log('repeated dimension grp: '+ j[s_index])
									var pos = tempobj[j[s_index]];
									console.log('preves value :' +tempobj+" : "+pos+"  rows value: "+rows_value[pos]+"rows value string format: "+JSON.stringify(rows_value[pos])+"json value: "+ JSON.stringify(j));
									var q=1;
									 arr1 = rows_value[pos];
									for(var k=index,l;l=j[k];++k){
										console.log('rep metrics value:' +l+" array vakue: "+JSON.stringify(arr1));
										console.log('parser array value: '+parseInt(arr1[q])+"  orginaal value: "+ arr1[q]);
										console.log('addition value: '+ parseInt(arr1[q])+" "+ parseInt(l)+" "+(parseInt(arr1[q])+parseInt(l)).toString());
										var tp = (parseInt(arr1[q])+parseInt(l)).toString();
										console.log("add value: "+ tp);
										arr1[q++]=tp;
										console.log('rep obj value: '+arr1 )
										
									}
									rows_value[pos] = arr1;
									console.log(tempobj);
									console.log(rows_value[pos]);
									
								}
								else{
									console.log("Else part Index value: "+ JSON.stringify(j[s_index])+ "Object value: "+tempobj[j[s_index]]);
									var arr=[];
									console.log('rows obj'+rows_value);
									console.log('dimension grp: '+ j[s_index])
									var q=0;
									arr[q++] = j[s_index]
									
									for(var k=index,l;l=j[k];++k){
										console.log('metrics value:' +l);
										arr[q++]=l;
										console.log('obj value'+arr);																			
									}
									console.log("objindex: "+obj_index);
									rows_value [obj_index] = arr;
									tempobj[j[s_index]] = obj_index;
									
									console.log("temp"+tempobj[j[s_index]]);
									console.log('rows'+rows_value[obj_index]);
									console.log('string value: '+ JSON.stringify(tempobj));
									obj_index++;
								}	
							}
							console.log(tempobj);
							console.log(rows_value);
							console.log(column_header);
							tempobj=null;
							
							jsonobj['columnHeaders']=column_header;
							jsonobj['rows']=rows_value;
							generateTable(jsonobj);
						
					}

					
	//end				
					
				
		    }); 
	//main function end
  
  //adding dimension
  function dimensionadd(dimension){
	  var dimension_arr = dimension.split(',');
	  var selectbox = document.getElementById('dimension_grp');
	  selectbox.innerHTML = "";
	  var option = '<option value="-1">Select Dimension for group</option>';	  
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
		console.log("append default value"+data);
		console.log("userlistvalue"+localStorage.getItem('userlist'));
		if(localStorage.getItem('userlist') != null){
			temp = localStorage.getItem('userlist');
			temp=temp.substring(0,temp.length-1);
			console.log("temp valeu"+temp);
			localStorage.setItem("userlist",temp.concat(','+data.substring(1)));
			console.log("data value"+data.substring(1));
		}
		else
			localStorage.setItem("userlist",data);		
		console.log(parsedata);		
		for(var index in parsedata){
			arrprofile[k++]=index;
		}
		console.log("key value"+arrprofile);
		//console
		for(var i=0,j;( j=arrprofile[i] );++i){
			console.log(j);			
			$('<div id='+j+'><input type="radio" name="userProfile" id="usrProf" value="'+j+'"><label>'+JSON.parse(localStorage.getItem('userlist'))[j].profileName+'</label>&nbsp;&nbsp;</div>').prependTo($('#getuserprofile'));
		}
	// radio button selected
		$("input:radio").unbind( 'click' );
		$("input:radio").bind( 'click', function(){
			console.log("hi radio");
			 console.log("radio button");
			 var ippos;
			 console.log(  'The ID is: '+div_id );
			 
			    if(div_id)
			      document.getElementById(div_id).removeChild(node); 
			    
			  console.log($(this).attr("value"));
			    node=document.createElement('input');
			    node.setAttribute('type','button');
			    node.setAttribute('value','Apply');
			    node.setAttribute('id','getvalue');
			    div_id=$(this).attr("value");
			   console.log("div id"+div_id);
			   var jsonObj1 = JSON.parse((localStorage.getItem('userlist')));
			    for(var pos in jsonObj1){			    	
			    	if(pos==$('input:radio:checked').val()){
			    		console.log(jsonObj1[pos]);
			    		ippos=pos;
			    		console.log(div_id);
			    		$.notify("Query: "+JSON.stringify(jsonObj1[pos]),"info");
			    		
			    	}
			    }
			    
			  document.getElementById(div_id).appendChild(node);    
			  $('#getvalue').click(function(){			    
			    var json = jsonObj1[ippos];	
			    console.log(json);
			    console.log("table"+json.queryId);
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
    * dGenerate table
    */
   function generateTable(data){
	   
		console.log(data);
		console.log(typeof data);		
		var outputvalue = data; 
		var div = document.getElementById('tablechart');
		div.innerHTML = "";
		var table = document.createElement('table');
		table.setAttribute('border','1');
		table.setAttribute('class','tablesorter');
		table.setAttribute('id','gatable');
		
		var thead = document.createElement('thead');
		var col_tr = document.createElement('tr');
		
//		 dataTable = new google.visualization.DataTable;
		 console.log(outputvalue.rows);
		 //console.log(!outputvalue.rows.length);
		if(typeof outputvalue.rows =="undefined" ){
			var th = document.createElement('th');
			var text = document.createTextNode('No result Found');
			th.appendChild(text);
			col_tr.appendChild(th);
			thead.appendChild(col_tr);
			table.appendChild(thead);
//			dataTable.addColumn("string",'none');
//			dataTable.addRows(1);
//			dataTable.setCell(0,0,"no results found");
			$('#totalcountrep').text(" ");

		}
		else{
			var text;
			var th;
			th= document.createElement('th');
			text = document.createTextNode('Index\u00A0\u00A0\u00A0\u00A0');
			th.appendChild(text);
			col_tr.appendChild(th);
//			dataTable.addColumn("number","Index");
			for(var i=0,j; j=outputvalue.columnHeaders[i];++i){
				th = document.createElement('th');
				text = document.createTextNode(j.name+'\u00A0\u00A0\u00A0\u00A0\u00A0');
				th.appendChild(text);
				col_tr.appendChild(th);
//				dataTable.addColumn('DIMENSION' == j.columnType ? "string":"number",j.name);
				console.log("i value "+i+"j avalue "+j);
			}			
			thead.appendChild(col_tr);
			table.appendChild(thead);
//			console.log(dataTable.getNumberOfColumns());
			var tbody = document.createElement('tbody');
			var td;
			var tr;
			var text_1;
			
			console.log('output rows value: '+outputvalue.rows);
//			dataTable.addRows(outputvalue.rows.length); 
			for(var k=0, l; l=outputvalue.rows[k]; ++k){
				tr = document.createElement('tr');
				td = document.createElement('td');
				text_1 = document.createTextNode(k+1);
				td.appendChild(text_1);
				tr.appendChild(td);
				console.log('row value:  '+ JSON.stringify(l));
//				dataTable.setCell(k,0,k+1);
				for(var m=0, n; n=l[m]; ++m){
					td = document.createElement('td');
					text_1 = document.createTextNode(n);
					console.log("textvalue: "+ text_1 +" value from array: "+n);
					td.appendChild(text_1);
					tr.appendChild(td);
//					var p = outputvalue.columnHeaders[m];
//					var q = n;
//					console.log(q+"m value"+m+"k:value"+k);
//					var r = p.dataType;
//					if("INTEGER" == r)
//					    q = parseInt(n,10);
//					else if("CURRENCY" == r)
//					    q = parseFloat(n);
//					else if("PERCENT" == r || "TIME" == r || "FLOAT" == r)
//						q = Math.round(100 * q ) / 100;
//					dataTable.setCell(k,m+1,q);

				}
				tbody.appendChild(tr);
			}
			   table.appendChild(tbody);
			   console.log(table);
			  
			   div.appendChild(table);
			   $('#gatable').tablesorter();
			   if(outputvalue.totalResults)
			$('#totalcountrep').text("total no. of results "+outputvalue.totalResults);
		}
   }
   
	/**
	 * display the chart
	 */			
	function displaychart(data){
		generateTable(data)
		
//		console.log( dataTable); 
//       console.log( JSON.stringify(dataTable)); 
//       console.log( JSON.parse(JSON.stringify(dataTable))); 
       $('#formvalues').hide();
       $('#userProfile').hide();
       
       $('#gaheader').show();
       $('body').css('cursor','default');
       
//        display(dataTable);
		
	}	
   //function start for csv download
   
   /**
    * Creating the CSV File And Download Option
    */
function csvDownload(data,ReportTitle){

	var jsonData = typeof data != 'object' ? JSON.parse(data) : data ;
	var CSV = '';
	CSV += ReportTitle + '\r\n\n';		
	for(var a=0,b;b=jsonData.cols[a];++a)
		CSV += b.label+',';
	CSV += '\r\n';
	for(var c=0,d;d=jsonData.rows[c];++c){
		for(var e=0,f;f=d.c[e];++e)			
			CSV += f.v +',';		
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
}
   
/**
 * Displaying the Table CharDAta and Area Chat
 * @param chartData
 */
  //function end for csv
//  function display(chartData)
//  {           		
//      		var tablechart = new google.visualization.Table(document.getElementById('tablechart'));
//      		tablechart.draw(chartData, null);     		
//  };
