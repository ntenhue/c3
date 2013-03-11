function ListView(parent, calendarModel) {

	this.cldrList = [];
	this.listCalendarsDiv = $("<div>");
	parent.append(this.listCalendarsDiv);

	
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
	calendarModel.addObserver(this);
	appModel.addObserver(this);

	// This function gets called when there is a change in the model
	this.update = function(what, k) {

		if (what == "calendars") {
			this.listCalendarsDiv.empty();

			var calendars = calendarModel.getCalendars();
			for ( var i in calendars) {

				var item = new this.item();
				item.square.attr("id", i).appendTo(item.div);
				item.div.append(" ");
				item.label.html(calendars[i].summary).appendTo(item.div);
				item.div.append(" ");
				item.status.html(appModel.getCldrStatus(i)).appendTo(item.div);
				item.div.append("<br>");

				this.cldrList[i] = item;
				this.listCalendarsDiv.append(this.cldrList[i].div);
				}
			
			this.listCtrl= new ListCtrl(this,calendarModel);

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
			for ( var i in this.cldrList)this.cldrList[i].status.html(appModel.getCldrStatus(i));
			}
		
		if (what == "events loaded") {		
			appModel.setWorkingStatus("calculating occupancy...");
			calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
	
			yearViewUpdate();
			monthViewUpdate();
		}

		}
}




function ListCtrl(listView, calendarModel) {

for ( var i in calendarModel.calendars) {

	listView.cldrList[i].square.click(function() {
		
		appModel.selectedCldrs[$(this).attr('id')] = !appModel.selectedCldrs[$(this).attr('id')];

		var see = 0;
		var k;

		for ( var i in listView.cldrList) {
			if (appModel.selectedCldrs[i]&& appModel.cldrStatus[i] == '') {
				askGoogle.checkUpdatesAndLoad(i);
				see++;
				}
			}

		setTimeout(	function() {
		for ( var i in appModel.selectedCldrs) {
			if (appModel.selectedCldrs[i] 
			&& !(appModel.getCldrStatus() == "updated" 
			|| appModel.getCldrStatus() == "loaded"))see = 0;
			}
			}, 500);

		if (see != 0) {
			appModel.setWorkingStatus("calculating occupancy...");
			calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars, appModel.selectedCldrs);
			yearViewUpdate();
			monthViewUpdate();
			}
		
		listView.update("calendarsOnOff", null);
		}); // click function

	}// for calendars
}
	