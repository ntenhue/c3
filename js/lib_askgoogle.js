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
			
			if (resp.nextPageToken != null){
				if (appModel.selectedCldrs[k]) {
					askGoogle.loadEvents(k,resp.nextPageToken);
				}else{
					console.log(calendarModel.calendars[k].summary, "DOWNLOADING CANCELLED"); 
					calendarModel.clearEvents(k);
				}
			}
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


