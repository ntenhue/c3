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

	if (what == "complexity changed" ) {		
		appModel.setWorkingStatus("calculating occupancy...");
		calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
		yearViewUpdate();
		monthViewUpdate();
		legendView("#legendhere");
		}
	
	
	if (what == "events added" ) {
		appModel.setWorkingStatus("");
		var see = 0;
		for (var i in appModel.selectedCldrs) { if (appModel.selectedCldrs[i])see=1; }
		for (var i in appModel.selectedCldrs) { if  
					   (appModel.cldrStatus[i].substring(0,8) == "<br>load" /*||
						appModel.cldrStatus[i] == "loading..."*/ )see=0;}
		if (see!=0) {		
			appModel.setWorkingStatus("calculating occupancy...");
			calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
			yearViewUpdate();
			monthViewUpdate();
			legendView("#legendhere");
			}
		}
	
	
	}//update
}



function AppCtrl(appModel, appView) {
	/*
	 * Initialization
	 * Startup work flow
	 *
	 */
	
	//authentification = new Authentification(appModel);
	
	// while waiting API to load, initialize model and create the grid
	calendarModel = new CalendarModel(appModel);
	yearViewUpdate();
	legendView("#legendhere");

	
	appModel.addObserver(this);
	this.update = function(what) {

		if (what == "library loaded") {
			// the other necessary things are called by message, asynchronously
			listView = new ListView($("#listhere"), calendarModel);
			toolbarView = new ToolbarView($("#toolbarhere"), calendarModel);
			askGoogle = new AskGoogle(calendarModel);			
			askGoogle.loadCalendars();
			}	
		
		
		if (what == "calendars loaded") {
			for ( var k in appModel.selectedCldrs) {
				appModel.setWorkingStatus("loading...");
				appModel.setCldrStatus(k,"loading...");
				askGoogle.loadEvents(k,null,null);
				}//for
			}

		if (what == "updated yearframe") {
			for ( var k in appModel.selectedCldrs) {
                yearViewUpdate();
				appModel.setWorkingStatus("loading...");
				appModel.setCldrStatus(k,"loading...");
				askGoogle.loadEvents(k,null,null);
				}//for
			}
		
	}//update
}
