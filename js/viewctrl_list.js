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




function listClick(listView, calendarModel, index) {
	
	appModel.selectedCldrs[index] = !appModel.selectedCldrs[index];

	var see = 0;

	for ( var k in appModel.selectedCldrs) {
		if (appModel.selectedCldrs[k]&& appModel.cldrStatus[k] == '') {
			askGoogle.checkUpdatesAndLoad(k);
			see++;
			}
		}

	setTimeout(	function() {k
	for ( var k in appModel.selectedCldrs) {
		if (appModel.selectedCldrs[k] 
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

}
	