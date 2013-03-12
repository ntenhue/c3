
function AskGoogle(calendarModel) {
	
	this.loadCalendars = function() {
		this.request =  gapi.client.calendar.calendarList.list();	
		this.request.execute(function(resp) {
			console.log("received calendars list:", resp);
			
			calendarModel.clearCalendars();
			calendarModel.addCalendars(resp.items);
			});
		}
	
	
	
	this.checkUpdatesAndLoad = function(k) {
		appModel.setCldrStatus(k,"checking...");
		
		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'fields': 'updated',
			});
		
		this.request.execute(function(resp) {
			console.log(calendarModel.calendars[k].summary, "checking calendar updates:", resp.updated);
			
			
			if(resp.updated == calendarModel.calendars[k].updated
			&& calendarModel.calendars[k].events != null) {
				console.log(calendarModel.calendars[k].summary, "already up-to-date")
				appModel.setCldrStatus(k,"updated");
			}else{
				console.log(calendarModel.calendars[k].summary, "updates found"); 
				
				appModel.setCldrStatus(k,"clearing...");
				calendarModel.clearEvents(k);
				
				appModel.setCldrStatus(k,"loading...");
				askGoogle.loadEvents(k,null);
				
				
				}
			});
		}
		
		
	
	
	// TODO: check this, optimize, remove magic number if possible
	this.loadEvents = function(k, pageToken) {
		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'maxResults': 250,
			'singleEvents': true,
			'showDeleted': false,
			'orderBy': 'startTime',
			'timeMax': (appModel.yearLast+1)+'-01-01T00:00:00+01:00', //+1 because it is exclusive
			'fields': 'items(colorId,start,end,summary,id),nextPageToken,updated',
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
	
	
	
	
}//function AskGoogle


