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
/*	this.checkUpdatesAndLoad = function(k) {
		appModel.setCldrStatus(k,"checking...");
		
		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'fields': 'updated',
			});
		
		this.request.execute(function(resp) {
			//console.log(calendarModel.calendars[k].summary, "checking calendar updates:", resp.updated);
			
			
			if (calendarModel.calendars[k].events == null || calendarModel.calendars[k].updated ==""){
					//console.log(calendarModel.calendars[k].summary, "no events found")
					appModel.setCldrStatus(k,"loading...");
					askGoogle.loadEvents(k,null,null);				
			}else{
				
				if(Date.parse(resp.updated) <= Date.parse(calendarModel.calendars[k].updated)) {
					//console.log(calendarModel.calendars[k].summary, "already up-to-date")
					appModel.setCldrStatus(k,"updated");
					appModel.setWorkingStatus("");	
				}else{
					console.log(calendarModel.calendars[k].summary, "updates found"); 
					appModel.setCldrStatus(k,"loading...");
					askGoogle.loadEvents(k,null,calendarModel.calendars[k].updated);
				}
			}
			});
		
		appModel.setCldrStatus(k,"loading...");
		askGoogle.loadEvents(k,null);	
		
		}
		*/
		
	
	/*
	 * loadEvents
	 * function calls Google and asks for events with specified settings
	 * if the return is not empty, then the model is updated
	 * if there are more pages to load, function calls itself as a recursive
	 * 
	 */	
	this.loadEvents = function(k, pageToken) {

		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'maxResults': 250,
			'singleEvents': true,
			'showDeleted': true,
			'orderBy': 'startTime',
			'timeMin': (appModel.yearFirst)+'-01-01T00:00:00+01:00', 
			'timeMax': (appModel.yearLast+1)+'-01-01T00:00:00+01:00', //+1 because it is exclusive
			'fields': 'items(colorId,start,end,summary,id,location,htmlLink,status),nextPageToken,updated',
			'updatedMin': (calendarModel.calendars[k].updated==""?null:calendarModel.calendars[k].updated),
			'pageToken': pageToken
			});
		
		
		this.request.execute(function(resp){
			console.log(calendarModel.calendars[k].summary, "received events list:", resp); 
			
			if (resp.items!=null && resp.items.length>0 && 
				resp.updated.substring(0,19)!=calendarModel.calendars[k].updated.substring(0,19)){
				calendarModel.addEvents(k,resp.items,resp.updated,resp.nextPageToken);
			}else{
				appModel.setWorkingStatus("");				
				appModel.setCldrStatus(k,"updated");
			}
			
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


