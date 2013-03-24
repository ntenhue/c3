/*
 * AskGoogle
 * custom library written on the basis of GCalendar API documentation
 * 
 */


function AskGoogle(calendarModel) {

	/*
	 * loadCalendars
	 */
	this.loadCalendars = function() {
		this.request =  gapi.client.calendar.calendarList.list();	
		this.request.execute(function(resp) {
			console.log("received calendars list:", resp);	
			calendarModel.clearCalendars();
			calendarModel.addCalendars(resp.items);
			});
		}
	
	
	
	/*
	 * checkUpdatesAndLoad
	 * function calls Google and asks for "updated" timestamp of calendar k
	 * then it compares it with the timestamp stored at the previous successful load
	 * 
	 * if updates found or if there is no events loaded then 
	 * 
	 */	
	this.checkUpdatesAndLoad = function(k) {
		appModel.setCldrStatus(k,"checking...");
		
		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'fields': 'updated',
			});
		
		this.request.execute(function(resp) {
			//console.log(calendarModel.calendars[k].summary, "checking calendar updates:", resp.updated);
			
			
			if(resp.updated == calendarModel.calendars[k].updated
			&& calendarModel.calendars[k].events != null) {
				//console.log(calendarModel.calendars[k].summary, "already up-to-date")
				appModel.setCldrStatus(k,"updated");
				appModel.setWorkingStatus("");
				
				
			}else{
				console.log(calendarModel.calendars[k].summary, "updates found"); 
				
				appModel.setCldrStatus(k,"clearing...");
				calendarModel.clearEvents(k);
				
				appModel.setCldrStatus(k,"loading...");
				askGoogle.loadEvents(k,null);
				
				
				}
			});
		}
		
		
	
	/*
	 * loadEvents
	 * function calls Google and asks for events with specified settings
	 * if the return is not empty, then the model is updated
	 * if there are more pages to load, function calls itself as a recursive
	 * 
	 */	
	// TODO: check this, optimize, remove magic number if possible
	this.loadEvents = function(k, pageToken) {
		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'maxResults': 250,
			'singleEvents': true,
			'showDeleted': false,
			'orderBy': 'startTime',
			'timeMin': (appModel.yearFirst)+'-01-01T00:00:00+01:00', 
			'timeMax': (appModel.yearLast+1)+'-01-01T00:00:00+01:00', //+1 because it is exclusive
			'fields': 'items(colorId,start,end,summary,id,location,htmlLink),nextPageToken,updated',
			'pageToken': pageToken
			});
		
		
		this.request.execute(function(resp){
			console.log(calendarModel.calendars[k].summary, "received events list:", resp); 
			if (resp.items != null)calendarModel.addEvents(k,resp.items,resp.updated,resp.nextPageToken); 
			if (resp.nextPageToken != null)askGoogle.loadEvents(k,resp.nextPageToken);
				// if there are more pages to show,
				// the function calls itself with a nextPageToken
				// recursion is stopped on the last page, 
				// since nextPageToken of it is NULL
			});
		
		}// function loadEvents
	
	
	/*
	 * getEventDetails
	 * function calls Google and asks for specific event
	 * in specific calendar
	 * 
	 */	
	this.getEventDetails = function(k, eventId, callback) {
		this.request = gapi.client.calendar.events.get({
			'calendarId': calendarModel.calendars[k].id, 
			'eventId': eventId
			});
		
		this.request.execute(function(resp) {
			console.log(eventId, "received event details: ", resp);
			callback(resp);
		});
	}
	
	
	
	
}//function AskGoogle


