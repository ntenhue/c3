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
				item.square.on("mousedown", { index: i }, iWannaChooseCalendars); // attach listener
				
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
			if (appModel.cldrStatus[i] == "loading..." ||
				appModel.cldrStatus[i].substring(0,8) == "<br>load" )	{
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
			askGoogle.checkUpdatesAndLoad(k);
			}
		}//for
}














function ToolbarView(parent /*JQuery object*/, calendarModel) { 

	/***************************************************************************
	 * INITIALIZATION
	 **************************************************************************/

	this.barDiv = $("<div>");
	this.searchLine = $('<input type="text" value="Search and hit enter!">')
		.bind("keyup focusin focusout", {view: this}, iWannaSearch); // attach listener
	
	this.durMinLine = $('<input type="text" value="'+appModel.searchDurationMin+'">')
		.bind("keyup focusin focusout", {view: this, what: "min"}, iWannaFilterDuration); // attach listener
	this.durMaxLine = $('<input type="text" value="'+appModel.searchDurationMax+'">')
		.bind("keyup focusin focusout", {view: this, what: "max"}, iWannaFilterDuration); // attach listener

	
	this.searchCheck = $('<input type="checkbox" id="searchcheck" text="hide filtered">');	
	this.searchCheckLabel = $('<label for="searchcheck">').text("hide filtered");
	this.searchCheck.bind("click", {view: this}, iWannaHideFiltered); // attach listener
	
	
	/***************************************************************************
	 * ASSEMBLING THE VIEW
	 **************************************************************************/
 	this.barDiv.append(this.searchLine, this.durMinLine, this.durMaxLine, this.searchCheck, this.searchCheckLabel);
	parent.append(this.barDiv);
	
	
}


function iWannaHideFiltered(event) {
	appModel.searchHideFiltered=event.data.view.searchCheck.prop("checked");
	search();
	
}


function iWannaFilterDuration(event) {
	if (event.type == "keyup" && event.keyCode==13) {
		if (event.data.what == "min")appModel.searchDurationMin = +event.data.view.durMinLine.val(); 
		if (event.data.what == "max")appModel.searchDurationMax = +event.data.view.durMaxLine.val(); 
		search();
		}//keyup
}


function iWannaSearch(event) {
	
	if (event.type == "focusin") {	
	    event.data.view.searchLine.val(appModel.searchString);
	}

	if (event.type == "focusout") {	
		if(appModel.searchString=="")event.data.view.searchLine.val("Search and hit enter!");
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
