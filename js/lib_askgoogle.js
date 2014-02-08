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
	this.loadEvents = function(k, year, pageToken) {
        if (year == null) year = appModel.yearFirst;

		this.request = gapi.client.calendar.events.list({
			'calendarId': calendarModel.calendars[k].id, 
			'maxResults': 250,
			'singleEvents': true,
			'showDeleted': true,
			'orderBy': 'startTime',
			'timeMin': (year)+'-01-01T00:00:00+01:00',
			'timeMax': (year+1)+'-01-01T00:00:00+01:00', //+1 because it is exclusive
			'fields': 'items(colorId,start,end,summary,id,location,htmlLink,status),nextPageToken,updated',
			'updatedMin': (calendarModel.calendars[k].dataAvailable[year]),
			'pageToken': pageToken
			});
		
		
		this.request.execute(function(resp){
			console.log(calendarModel.calendars[k].summary, "received events list:", resp); 
			
			if (resp.items!=null && resp.items.length>0
               //if the calendar is already up to date
               && resp.updated!=calendarModel.calendars[k].dataAvailable[year]
               ){
				calendarModel.addEvents(k,resp.items,resp.updated,year,resp.nextPageToken);
			}else{
				appModel.setWorkingStatus("");				
				appModel.setCldrStatus(k,"updated");
			}
			
            // check if the calendar is still interesting to user
            if (appModel.selectedCldrs[k]) {
                if (resp.nextPageToken != null){
                        askGoogle.loadEvents(k,year,resp.nextPageToken);
                }else{
                    if(year < appModel.yearLast){
                        askGoogle.loadEvents(k,year+1,null);
                    }else{
                        calendarModel.prepareData(k);
                    }
                }
            }else{
                // calendar was unselected while downloading
                console.log(calendarModel.calendars[k].summary, "DOWNLOADING CANCELLED");
                calendarModel.clearEvents(k);
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


