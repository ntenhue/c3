function ListView(parent, calendarModel) {

	this.cldrList = [];
	this.listCalendarsDiv = $("<div>");
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


 	this.statusDiv.append(this.spinSpan, this.statusTextSpan);
	parent.append(this.listCalendarsDiv, this.statusDiv);

	
	this.item = function() {
		this.div = $('<div>');
		this.square = $('<div class="cldrListSquare">');
		this.label = $('<span class="cldrListCaption">');
		this.status = $('<span style="color:#CCCCCC" class="cldrListCaption">');
		}
	
	/***************************************************************************
	 * Observer implementation
	 **************************************************************************/

	// Register an observer to the model
	appModel.addObserver(this);

	// This function gets called when there is a change in the model
	this.update = function(what, k) {

		if (what == "calendars loaded") {
			this.listCalendarsDiv.empty();

			var calendars = calendarModel.getCalendars();
			for ( var i in calendars) {

				var item = new this.item();
				item.square.attr("id", i).appendTo(item.div);
				item.div.append(" ");
				item.label.html(calendars[i].summary).appendTo(item.div);
				item.div.append(" ");
				item.status.html("").appendTo(item.div);
				item.div.append("<br>");
				// TODO: check parameter referencing in JS to callbacks
				item.square.click(function() {listClick(listView, calendarModel, $(this).attr('id'));});	

				this.cldrList[i] = item;
				this.listCalendarsDiv.append(this.cldrList[i].div);
					
				}
			}

		if (what == "calendarsOnOff") {

			var calendars = calendarModel.getCalendars();
			for ( var i in calendars) {
				if (appModel.selectedCldrs[i]) {
					this.cldrList[i].square.css("background-color",calendars[i].backgroundColor);
					this.cldrList[i].square.css("border-color",calendars[i].backgroundColor);
				} else {
					this.cldrList[i].square.css("background-color", "#FFFFFF");
					this.cldrList[i].square.css("border-color", "#CCCCCC");
					}
				}
			}

		if (what == "cldrStatus") {
			for ( var i in this.cldrList)
			if (appModel.cldrStatus[i].substring(0,7) == "loading" ||
				appModel.cldrStatus[i].substring(0,8) == "<br>load" )	{
				this.cldrList[i].status.html(appModel.getCldrStatus(i));
			}else{
				this.cldrList[i].status.html("");
			}
			}
		
		if (what == "workingStatus") {
			this.statusTextSpan.html(appModel.workingStatus);
			//var opts = {};
			//var target = document.getElementById('foo');
			//var spinner = new Spinner({color:'#AAA', lines: 12}).spin(this.statusDiv);
			if (appModel.workingStatus == ""){
			//$('#spinnerhere').empty();
			this.spinner.stop(document.getElementById('spinnerhere'));
			}
			else{
			this.spinner.spin(document.getElementById('spinnerhere'));
			}
			}


		}
}




function listClick(listView, calendarModel, index) {
	
	// XXX: optimize this. slow call, find the culprit
	appModel.selectedCldrs[index] = !appModel.selectedCldrs[index];

	listView.update("calendarsOnOff", null);
	
	
	appModel.setWorkingStatus("calculating occupancy...");
	calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);

	yearViewUpdate();
	monthViewUpdate();
	
	
	for ( var k in appModel.selectedCldrs) {
		if (appModel.selectedCldrs[k] &&!(appModel.cldrStatus[k].substring(0,4) == "load")) {
			appModel.setWorkingStatus("loading...");
			askGoogle.checkUpdatesAndLoad(k);
			}
		}



}
	