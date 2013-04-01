/*
 * ListView - view class of rightside calendar list
 * params: calendarModel and parent - a JQuery object where to append the view 
 * 
 */

function ListView(parent /*JQuery object*/, calendarModel) { 

	/***************************************************************************
	 * INITIALIZATION
	 **************************************************************************/

	
	this.cldrList = [];
	this.listCalendarsDiv = $("<div>");
	this.item = function() {
		// one item in calendars list
		this.div = $('<div>');
		this.square = $('<div class="cldrListSquare">');
		this.label = $('<span class="cldrListCaption">');
		this.status = $('<span style="color:#CCCCCC" class="cldrListCaption">');
		}
	
	this.statusDiv = $('<div>');
	this.spinSpan = $('<div id="spinnerhere" class="spinspan">');
	this.statusTextSpan = $('<div style="color:#CCCCCC" class="statustextspan">');
	this.spinner = 
			new Spinner({ 
				lines: 6, 
				length: 3.5,
				width: 2.5,
				radius: 2,
				rotate: 0,
				corners: 1.0,
				color:'#AAA',
				trail: 60,
				speed: 1.0,
				trail: 100,
				opacity: 1/4,
				fps: 20,
				zIndex: 2e9,
				top: '1px',
				left: '1px',
				className: 'spinner',
				position: 'relative'});

	
	/***************************************************************************
	 * ASSEMBLING THE VIEW
	 **************************************************************************/
 	this.statusDiv.append(this.spinSpan, this.statusTextSpan);
	parent.append(this.listCalendarsDiv, this.statusDiv);


	
	/***************************************************************************
	 * Observer implementation
	 **************************************************************************/

	// Register an observer to the app model
	appModel.addObserver(this);
	
	this.update = function(what) {
		
		/*
		 * calendars loaded - make the list of calendars
		 * attach listeners to little squares
		 */
		if (what == "calendars loaded") {
			this.listCalendarsDiv.empty();

			var calendars = calendarModel.getCalendars();
			for ( var i in calendars) {

				var item = new this.item();
				item.square.attr("id", i).appendTo(item.div);
				item.div.append(" ");
				item.label.html(calendars[i].summary.substring(0,26)).appendTo(item.div);
				item.div.append(" ");
				item.status.html("").appendTo(item.div);
				item.div.append("<br>");
				item.div.css("cursor","pointer")
						.on("mouseover mouseout mousedown", { index: i }, iWannaChooseCalendars); // attach listener
				
				this.cldrList[i] = item;
				this.listCalendarsDiv.append(this.cldrList[i].div);
					
				}
			this.update("selectedCldrs");
			}

		/*
		 * refresh colors of squares
		 */
		if (what == "selectedCldrs") {
			
			for ( var i in this.cldrList) {
				if (appModel.selectedCldrs[i]) {
					this.cldrList[i].square.css("background-color",calendarModel.colors[i]);
					this.cldrList[i].square.css("border-color",calendarModel.colors[i]);
				} else {
					this.cldrList[i].square.css("background-color", "#FFFFFF");
					this.cldrList[i].square.css("border-color", "#CCCCCC");
					}
				}
			}

		/*
		 * refresh status labels in calendar list
		 */
		if (what == "cldrStatus") {
			for ( var i in this.cldrList)
			if (appModel.cldrStatus[i].substring(0,8) == "<br>load" )	{
				// show only when it looks like "loading" or something
				this.cldrList[i].status.html(appModel.getCldrStatus(i));
			}else{
				// otherwise hide status label
				this.cldrList[i].status.html("");
			}
			}
		
		/*
		 * refresh status label after calendar list
		 * and a spinner sign (Manfreds part)
		 */
		if (what == "workingStatus") {
			this.statusTextSpan.html(appModel.workingStatus);
			
			if (appModel.workingStatus == ""){
				this.spinner.stop(document.getElementById('spinnerhere'));
			}else{
				this.spinner.spin(document.getElementById('spinnerhere'));
			}
			}


		}
}


function iWannaChooseCalendars(event) { 
	
	if (event.type == "mouseover") {
		var index=event.data.index;
		listView.cldrList[index].square.css("background-color",calendarModel.colors[index]);
		listView.cldrList[index].square.css("border-color",calendarModel.colors[index]);
		listView.cldrList[index].div.css("background-color","#eeeeee");
	}
	
	if (event.type == "mouseout") {
		var index=event.data.index;
		listView.cldrList[index].div.css("background-color","#ffffff");
		listView.update("selectedCldrs");
	}
	
	if (event.type == "mousedown") {	
	var index=event.data.index;
	appModel.setSelectedCldrs(index, !appModel.getSelectedCldrs(index));

	if (appModel.cldrStatus[index] != "initiated"){
		appModel.setWorkingStatus("calculating occupancy...");
		calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
		yearViewUpdate();
		monthViewUpdate();
		legendView("#legendhere");
	}
	

	for ( var k in appModel.selectedCldrs) {
		
		if((appModel.selectedCldrs[k]) &&
		  !(appModel.cldrStatus[k].substring(0,8) == "<br>load"||
			appModel.cldrStatus[k] == "loading..." ||
			appModel.cldrStatus[k] == "checking...")){
			
			appModel.setWorkingStatus("loading...");
			appModel.setCldrStatus(k,"loading...");
			askGoogle.loadEvents(k,null);	
			}
		}//for
	
	}//click
}














function ToolbarView(parent /*JQuery object*/, calendarModel) { 

	/***************************************************************************
	 * INITIALIZATION
	 **************************************************************************/

	this.barSpan = $("<div>")
		.attr("style","display:inline");
	
	this.searchLine = $('<input type="text" value="Search and hit enter">')
		.bind("keyup focusin focusout", {view: this}, iWannaSearch); // attach listener
	
	this.moreSpan = $("<div>")
		.attr("style","cursor:pointer; text-decoration:underline; display:inline")
		.text("more")
		.bind("click", {view: this}, iWannaMoreOptions); // attach listener
	
	
	this.moreOptionsSpan = $("<span>");
	
	this.durMinTextbox = $('<input type="text" value="'+appModel.searchDurationMin+'">')
		.attr("style","width:25px").addClass("compacttextbox")
		.bind("keyup focusin focusout", {view: this, what: "min"}, iWannaFilterDuration); // attach listener
	this.durMaxTextbox = $('<input type="text" value="'+appModel.searchDurationMax+'">')
		.attr("style","width:25px").addClass("compacttextbox")
		.bind("keyup focusin focusout", {view: this, what: "max"}, iWannaFilterDuration); // attach listener

	
	this.searchCheck = $('<input type="checkbox" id="searchcheck" text="hide filtered">');	
	this.searchCheckLabel = $('<label for="searchcheck">').text("hide filtered");
	this.searchCheck.bind("click", {view: this}, iWannaHideFiltered); // attach listener
	
	
	this.colorMinTextbox = $('<input type="text" value="'+appModel.lightestColorForHours+'">')
		.attr("style","width:25px").addClass("compacttextbox")
		.bind("keyup focusin focusout", {view: this, what: "min"}, iWannaSetColorRange); // attach listener
	this.colorMaxTextbox = $('<input type="text" value="'+appModel.strongestColorForHours+'">')
		.attr("style","width:25px").addClass("compacttextbox")
		.bind("keyup focusin focusout", {view: this, what: "max"}, iWannaSetColorRange); // attach listener

		
	this.colorFilterDiv = $("<div>")
		.attr("style","display:inline");
	var colorspaceForEvents = calendarModel.colorspaceForEvents;
	this.colorFilterItems = [];

	for (var i in colorspaceForEvents){//Google has 12 possible colors for events, specified by colorId. 0 is default color = color of the calendar
		var colorFilterItem = $("<div>")
		.css("display","inline-block")
		.css("cursor","pointer")
		.css("background-color",colorspaceForEvents[i])
		.css("border","1px solid" + colorspaceForEvents[i])
		.css("width","11px")
		.css("height","11px") 
		.appendTo(this.colorFilterDiv)
		.on("mousedown", { index: i }, iWannaFilterColors); // attach listener
	
		this.colorFilterDiv.append(" ");		
		this.colorFilterItems.push(colorFilterItem);
	}
	
	
	this.simpleComplexDiv = $("<div>")
		.attr("style","display:inline; float:right");
	
	this.simpleLabelSpan = $("<span>")
		.addClass("complexLabel")
		.text("simple")
		.addClass("complexLabel-active")
		.bind("click mouseover mouseout", {view: this, what: "simple"}, iWannaSimpleComplex); // attach listener

	this.complexLabelSpan = $("<span>")
		.addClass("complexLabel")
		.text("complex")
		.bind("click mouseover mouseout", {view: this, what: "complex"}, iWannaSimpleComplex); // attach listener

	

	
	/***************************************************************************
	 * ASSEMBLING THE VIEW
	 **************************************************************************/
 	this.barSpan.append(
 			this.searchLine );
	
 	this.moreOptionsSpan.append(
 			" Filter by event colors: ", this.colorFilterDiv,
 			" or duration, h: ", this.durMinTextbox, this.durMaxTextbox, 
 			" ", this.searchCheck, this.searchCheckLabel,
 			"<br/> Color scale min and max, h: ",
 			this.colorMinTextbox, this.colorMaxTextbox,
 			
 			" Enter numbers, apply by hitting enter. This is an experimental section :) ").hide();
 	
 	this.simpleComplexDiv.append(this.simpleLabelSpan,this.complexLabelSpan);

 	parent.append(this.barSpan, " " ,this.moreOptionsSpan,this.moreSpan, this.simpleComplexDiv);
 	
 	parent.attr("style","padding-top:25px; padding-left:50px");
	
 	
	/***************************************************************************
	 * Observer implementation
	 **************************************************************************/

	// Register an observer to the app model
	appModel.addObserver(this);
	
	this.update = function(what) {
		if (what == "color filtering"){
			for ( var i in this.colorFilterItems) {
				
				if (appModel.searchColors[i]){
					this.colorFilterItems[i].css("opacity","1.0")
					.css("border-color",this.colorFilterItems[i].css("background-color"));					
				}else{
					this.colorFilterItems[i].css("opacity","0.2")
					.css("border-color","#000");
				}
			("border-color", "#CCCCCC");
			}
		}
	}//update
	
}

function iWannaFilterColors(event) {
	appModel.searchColors[event.data.index] = !appModel.searchColors[event.data.index];
	toolbarView.update ("color filtering");
	search();
}

function iWannaSimpleComplex(event) {
		var s = event.data.view.simpleLabelSpan;
		var c = event.data.view.complexLabelSpan;
	
	if (event.type == "click") {	
		s.removeClass("complexLabel-active");
		c.removeClass("complexLabel-active");
		if (event.data.what=="simple"){	appModel.complexity = "simple";	s.addClass("complexLabel-active");		}
		if (event.data.what=="complex"){appModel.complexity = "complex"; c.addClass("complexLabel-active");	}
		appView.update("complexity changed");
		}
	
	if (event.type == "mouseover") {	
		if (event.data.what=="simple"){	s.addClass("complexLabel-active");	c.removeClass("complexLabel-active");}
		if (event.data.what=="complex"){	c.addClass("complexLabel-active");	s.removeClass("complexLabel-active");}
		}

	if (event.type == "mouseout") {	
		if (appModel.complexity == "simple"){s.addClass("complexLabel-active");	c.removeClass("complexLabel-active");}
		if (appModel.complexity == "complex"){c.addClass("complexLabel-active");s.removeClass("complexLabel-active");}
		}
	
	 
	}


function iWannaSearch(event) {
	
	if (event.type == "focusin") {	
	    event.data.view.searchLine.val(appModel.searchString);
	}

	if (event.type == "focusout") {	
		if(appModel.searchString=="")event.data.view.searchLine.val("Search and hit enter");
	}
	
	if (event.type == "keyup" && event.keyCode==13) {
		var searchfor = event.data.view.searchLine.val(); 	
	//	setTimeout(function() {			
	//	if (event.data.view.searchLine.val() == searchfor){ console.log(searchfor);

		appModel.searchString = searchfor;
		search();
				
	//	}}, 500);
	}//keyup

}



function iWannaMoreOptions(event) {
	event.data.view.moreOptionsSpan.toggle('fast');
	switch (event.data.view.moreSpan.text()) {
		case "more": event.data.view.moreSpan.text("hide"); break;
		case "hide": event.data.view.moreSpan.text("more"); break;	}

}



function iWannaFilterDuration(event) {
	if (event.type == "keyup" && event.keyCode==13) {
		appModel.searchDurationMin = +event.data.view.durMinTextbox.val(); 
		appModel.searchDurationMax = +event.data.view.durMaxTextbox.val(); 
		search();
		}//keyup
}

function iWannaSetColorRange(event) {
	if (event.type == "keyup" && event.keyCode==13) {
		appModel.lightestColorForHours = +event.data.view.colorMinTextbox.val(); 
		appModel.strongestColorForHours = +event.data.view.colorMaxTextbox.val(); 
		yearViewUpdate();
		legendView("#legendhere");
		}//keyup
}



function iWannaHideFiltered(event) {
	appModel.searchHideFiltered=event.data.view.searchCheck.prop("checked");
	search();
	
}


function search() {
	for ( var k in appModel.selectedCldrs) {	
		if (appModel.cldrStatus[k] == "updated" || appModel.cldrStatus[k] == "events added") {	
			calendarModel.calendars[k].events = calendarModel.filterEvents(calendarModel.calendars[k].events);
			calendarModel.calendars[k].busyHours = calendarModel.updateBusyHours(calendarModel.calendars[k]);
			}	
		}
	appModel.setWorkingStatus("calculating occupancy...");
	calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
	yearViewUpdate();
	monthViewUpdate();
}
