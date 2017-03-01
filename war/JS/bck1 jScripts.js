/**
 * 
 */


;
	var queryString;
	var dataTable ;	
	var profileName;
    var div_id;
    var node;
    var JSONDATA;
      

  

   
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
			//console.log("list profile");
			
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
				if(queryDetails){
					
				}
				
			});
			 $('#freq').change(function(){
				    var index=$('#freq option:selected').index();
				    
				    if(index==2){
				     // console.log("gi");
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
			
			  if(queryString != null){
				  queryString.emailId = $('#emailId').val();			
				  $.ajax({
					  type: "POST",
					  url: "/emailRequest",
					  contentType: "application/json",
					  dataType: "json",					 
					  data: JSON.stringify(queryString)
					  	  
				  })
				  .done(function(msg){
					
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
	  
	
	  if(!localStorage.getItem("AccountDetails")){
		  $.ajax({
          	type:"GET",
          	url:"/getAccountInfo",
          	contentType: "application/json"
          	
          })
           .done(function(msg){
          
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
 /** End Ajax for GetAccount Info on PageLoad   */
                
 /** 
  * Get the Properties detail of coressponding Account
 Start       */         
                $('#accountName').change(function(){
                	$('body').css('cursor','wait');
               
                	var acc_detail = {};                	
                	var acc_data = $('#accountName option:selected').val(); 
                	acc_detail.accountid = acc_data;
                
                	var propeties =[];
                	$('#propName').empty();  
             
                	if(!localStorage.getItem(acc_data)){
               
                		$.ajax({
                    		type:"POST",
                    		url:"/getPropertyInfo",    
                    		dataType: "json",
                    		data:  JSON.stringify(acc_detail),
                    		contentType: "application/json"
                    		
                    	})
                    	.done(function(msg){
                   
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
            	
            		var json_prop = JSON.parse(data);
            		
            		properties = json_prop; 
            		var prop_opt = "<option value=0>Select Properties</option>";
            		for( var index in properties){
            			prop_opt +="<option value='"+index+"'>" + properties[index] + "</option>";
            		
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
               	var properties_data = {AccountId:$('#accountName option:selected').val(),PropertiesID:$('#propName option:selected').val()};               	
                	properties_data = JSON.stringify(properties_data);
              
                	$("#profName").empty();
                	var profileInfo =[];
              
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
                
                		displayprofile(localStorage.getItem(properties_data));
                	}
                	
                });
                
                function displayprofile(profiledata){
                	$('body').css('cursor','default');
            		
            		var json_prof = JSON.parse(profiledata);
            		
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
	      		if(profileName != "" && profileName != null)
			      		$('#saveprofile').notify( "Profile will be save on next request","info",  { position:"bottom" } 				);
				  
	      		
	      		  
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
				
					if(queryString.metrics.lastIndexOf(',')==queryString.metrics.length-1){
						queryString.metrics = queryString.metrics.substring(0,queryString.metrics.length-1);
				
					}
					if(queryString.dimensions.lastIndexOf(',')==queryString.dimensions.length-1){
						queryString.dimensions = queryString.dimensions.substring(0,queryString.dimensions.length-1);
				
					}				
					
					if(profileName != "" && profileName != null)
					queryString.profileName = profileName;
					profileName="";	
					
					localStorage.setItem($('#emailInfo').text().trim()+','+date_1.getTime(),JSON.stringify(queryString));
					
					
					if($('#startdate').val() == '' || $('#tabl').val() == '' || $('#dimension_val').val() == '' || $('#metric_value').val() == '' || $('#enddate').val() == '' ){
					   
						alert("Please Enter (*) Required feild  value");
						
					}else{
					    
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
							
												tmpobj[size]=queryString;		
									
									        appendtoprofilelist(JSON.stringify(tmpobj));
											}
											
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
							generateTable(jsonobj);
						
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
										
				
		    }); 
	//main function end
  
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
	
			$('<div id='+j+'><input type="radio" name="userProfile" id="usrProf" value="'+j+'"><label>'+JSON.parse(localStorage.getItem('userlist'))[j].profileName+'</label>&nbsp;&nbsp;</div>').prependTo($('#getuserprofile'));
		}
	// radio button selected
		$("input:radio").unbind( 'click' );
		$("input:radio").bind( 'click', function(){

			 var ippos;
	
			 
			    if(div_id)
			      document.getElementById(div_id).removeChild(node); 
			    
	
			    node=document.createElement('input');
			    node.setAttribute('type','button');
			    node.setAttribute('value','Apply');
			    node.setAttribute('id','getvalue');
			    div_id=$(this).attr("value");
	
			   var jsonObj1 = JSON.parse((localStorage.getItem('userlist')));
			    for(var pos in jsonObj1){			    	
			    	if(pos==$('input:radio:checked').val()){
	
			    		ippos=pos;

			    		$.notify("Query: "+JSON.stringify(jsonObj1[pos]),"info");
			    		
			    	}
			    }
			    
			  document.getElementById(div_id).appendChild(node);    
			  $('#getvalue').click(function(){			    
			    var json = jsonObj1[ippos];	
	
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

			$('#totalcountrep').text(" ");

		}
		else{
			var text;
			var th;
			th= document.createElement('th');
			text = document.createTextNode('Index\u00A0\u00A0\u00A0\u00A0');
			th.appendChild(text);
			col_tr.appendChild(th);

			for(var i=0,j; j=outputvalue.columnHeaders[i];++i){
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
			$('#totalcountrep').text("total no. of results "+outputvalue.totalResults);
		}
   }
   
	/**
	 * display the chart
	 */			
	function displaychart(data){
		generateTable(data)
		

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
		var column_header={};
		temp_col['name'] = JSONDATA.columnHeaders[index].name;					
		column_header[t_idx++]=temp_col;
		temp_col = {};											
		for(var k=length;k<JSONDATA.columnHeaders.length;k++){
			temp_col['name'] = JSONDATA.columnHeaders[k].name;
	
			column_header[t_idx++]=temp_col;
	
			temp_col = {};	
		}
		
		for(var i=0,j;j=JSONDATA.rows[i];++i){
			
			if(j[index].indexOf(dimension) == 0 ){
				
					var obj_index =0;
			       json_arr[obj_index++]=dimension;
				   for(var k=length,l;l=j[k];++k){					   
					   if(!json_arr[obj_index])
					   json_arr[obj_index]=0;					  
					   var q = parseInt(json_arr[obj_index])+parseInt(l);
					   json_arr[obj_index++]= q.toString();					   
				   
				   }
				   
		
					
				
				
			}
		}
		temp_obj[0]=json_arr;
	
		var jsonvalue = {};
		jsonvalue['columnHeaders'] = column_header;
		jsonvalue['rows'] = temp_obj;
	
		generateTable(jsonvalue);
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
   

