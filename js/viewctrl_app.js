function AppView(parent, appModel) {

	this.workingSpan = $('<span style="color:#CCCCCC">');
	parent.append(this.workingSpan);
	
	
appModel.addObserver(this);
	
this.update = function(what) {
	if (what == "workingStatus") {
		this.workingSpan.html(appModel.getWorkingStatus());
		}
	
	if (what == "calendars loaded") {	
		yearView(null, appModel.selectedCldrs, calendarModel.colors,function() {});
		legendView("#legendhere");
		}
	
	if (what == "events added") {		
		appModel.setWorkingStatus("calculating occupancy...");
		calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);

		yearViewUpdate();
		monthViewUpdate();
		
	}
	
	if (what == "updated") {
		
		for ( var k in appModel.cldrStatus) {
			if(appModel.getCldrStatus(k) == "checking...") return false;
			}
		
		appModel.setWorkingStatus("calculating occupancy...");
		calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);

		yearViewUpdate();
		monthViewUpdate();
	}
	
	
	}//update
}



function AppCtrl(appModel, appView) {

	authentification = new Authentification(appModel);

	// Register an observer to the model
	appModel.addObserver(this);

	// This function gets called when there is a change at the model
	this.update = function(what) {
		
		if (what == "library loaded") {
			calendarModel = new CalendarModel(appModel);
			listView = new ListView($("#listhere"), calendarModel);
			askGoogle = new AskGoogle(calendarModel);			
			askGoogle.loadCalendars();
			}	
	}//update
}
