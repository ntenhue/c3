/*
 * ListView - view class of rightside calendar list
 * params: calendarModel and parent - a JQuery object where to append the view 
 * 
 */

function ListView(parent /*JQuery object*/, calendarModel) { var self=this;

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
				item.label.html(calendars[i].summary).appendTo(item.div);
				item.div.append(" ");
				item.status.html("").appendTo(item.div);
				item.div.append("<br>");
				// TODO: check parameter referencing in JS to callbacks
				//item.square.click(function() {listClick(listView, calendarModel, i /*$(this).attr('id')*/);});	

				

			
				item.square.on("click", { one: this, two: calendarModel, three: i }, listClick);

				
				
				this.cldrList[i] = item;
				this.listCalendarsDiv.append(this.cldrList[i].div);
					
				}
			}

		/*
		 * refresh colors of squares
		 */
		if (what == "selectedCldrs") {

			var calendars = calendarModel.getCalendars();
			for ( var i in this.cldrList) {
				if (appModel.selectedCldrs[i]) {
					this.cldrList[i].square.css("background-color",calendars[i].backgroundColor);
					this.cldrList[i].square.css("border-color",calendars[i].backgroundColor);
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
			if (appModel.cldrStatus[i].substring(0,7) == "loading" ||
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




//function listClick(listView, calendarModel, index) {
	
function listClick(event) { var listView=event.data.one;
							var calendarModel=event.data.two;
							var index=event.data.three;


	// XXX: optimize this. slow call, find the culprit
	appModel.setSelectedCldrs(index, !appModel.getSelectedCldrs(index));

	//listView.update("calendarsOnOff");
	
	
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
	