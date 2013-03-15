/*
 * App View and controller
 * 
 * Messages on status updates are posted to globally visible app model
 * this part contains the code to handle messaging 
 * 
 */

function AppView(parent, appModel) {

/*
 * Only updaters there so far
 * 
 */
	
	
appModel.addObserver(this);	
this.update = function(what) {

	if (what == "calendars loaded") {
		// create year view at the first time
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
	/*
	 * Initialization
	 * Startup work flow consists only of one predefined call
	 *
	 */
	
	authentification = new Authentification(appModel);

	
	appModel.addObserver(this);
	this.update = function(what) {

		if (what == "library loaded") {
			// initialization
			// the other necessary things are called by message, asynchronously
			calendarModel = new CalendarModel(appModel);
			listView = new ListView($("#listhere"), calendarModel);
			askGoogle = new AskGoogle(calendarModel);			
			askGoogle.loadCalendars();
			}	
		
	}//update
}
