/*
 * Calendar Model
 * Contains all data and performs methods over it
 * 
 */

function CalendarModel(appModel){
	this.calendars= [];
	this.totalBusyHours = []; 
	this.colors = [];
	



/***************************************************************************
 * SETTERS
 **************************************************************************/

this.addCalendars = function (items) {	
	for (var i in items){
		items.events = [];
		items.updated = "";
		items.busyHours = [];
		}
	this.calendars = this.calendars.concat(items);
	this.calendars = this.sortCalendars(this.calendars);
	
	for(var i in this.calendars)this.colors[i] = this.calendars[i].backgroundColor;
	

	appModel.setCldrStatus(this.calendars.length,"initiated");
	appModel.setSelectedCldrs(this.calendars.length,false);
	appModel.setCalendarsLoaded(true); // this will trigger the observer of app model
	}


this.addEvents = function (k, items, upd, nextPageToken) {	
	this.calendars[k].events = this.calendars[k].events.concat(items);

	var last = items[items.length-1].start;
	if (last.date == null)last.date = last.dateTime.substring(0,10);
	appModel.setCldrStatus(k,"<br>loading events... "+last.date);
	
	
	if (nextPageToken==null){
		// if this is a last or the only page of events
		this.calendars[k].updated= upd;
		this.calendars[k].events = this.updateEventsDuration(this.calendars[k].events);
		this.calendars[k].events = this.updateEventColor(this.calendars[k].events);
		this.calendars[k].busyHours = this.updateBusyHours(this.calendars[k].events);
		appModel.setCldrStatus(k,"events added");	
		}
	}	


/***************************************************************************
 * DESTROYERS
 **************************************************************************/

this.clearCalendars = function () {	
	this.calendars=[];
	this.totalBusyHours = []; 
	this.colors = [];
	appModel.setCldrStatus(this.calendars.length,"cleared");
	appModel.setCalendarsLoaded(false);	
	}	

this.clearEvents = function (k) {	
	this.calendars[k].events=[];
	this.calendars[k].updated = [];
	this.calendars[k].busyHours = [];
	appModel.setCldrStatus(k,"events cleared");
	}	


/***************************************************************************
 * GETTERS
 **************************************************************************/
this.getCalendars = function () { return this.calendars;	        }
this.getEvents = function (k) 	{ return k != null ? this.calendars[k].events : null;	}	
this.getTotalBusyHours = function () { return this.totalBusyHours;	        }
this.getBusyHours = function (k) { return k != null ? this.calendars[k].busyHours : null;	        }



/***************************************************************************
 * METHODS OVER DATA
 **************************************************************************/

/*
 * findCalendarBySummary
 */
this.findCalendarBySummary = function (summary){
	for (var i in this.calendars){
		if (this.calendars[i].summary==summary){
			return	i;
			}
		}
	}
	


/*
 * sortCalendars
 * TODO: Rewrite efficiently. David says it is hhhhhhorible))
 */
this.sortCalendars = function(calendars){
	var result=[];
	for (var i in calendars){if(calendars[i].primary)result.push(calendars[i]);  }
	for (var i in calendars){if(calendars[i].accessRole=="owner" && !calendars[i].primary)result.push(calendars[i]);}
	for (var i in calendars){if(calendars[i].accessRole=="writer")result.push(calendars[i]);}
	for (var i in calendars){if(calendars[i].accessRole=="reader")result.push(calendars[i]);}
	for (var i in calendars){if(calendars[i].accessRole=="freeBusyReader")result.push(calendars[i]);}	
	for (var i in calendars){if(calendars[i].accessRole=="")result.push(calendars[i]);}	
	for (var i in calendars){if(calendars[i].accessRole==null)result.push(calendars[i]);}	
	return result;
}
	


/*
 * getEventsInRange
 */
this.getEventsInRange = function(events, fromAsked,tillAsked){
	// params: array of events, a range of dates in format "yyyy-mm-dd"
	// returns: array of events which fall between the specified frames
	// valid requests formats: 
	// 1 to 15 march inclusive: ("2013-03-01","2013-03-15") 
	// all march: ("2013-03-01","2013-03-99")
	// all march: ("2013-03","2013-03")
	// all march: ("2013-03")
	// all 2013:  ("2013")
	
	// defensive coding
	if (events == null) {
		return null;
	}
	
	if (tillAsked == null) tillAsked=fromAsked;
	var result=[];
	
	var from = {"y":0,"m":0,"d":0}
	var till = {"y":9999,"m":99,"d":99}
	
	
	if (fromAsked.length>=4) from.y = fromAsked.substring(0,4);
	if (fromAsked.length>=7) from.m = fromAsked.substring(5,7);
	if (fromAsked.length>=9) from.d = fromAsked.substring(8,10);
							 from.date = new Date(from.y,from.m-1,from.d);
	
	if (tillAsked.length>=4) till.y = tillAsked.substring(0,4);
	if (tillAsked.length>=7) till.m = tillAsked.substring(5,7);
	if (tillAsked.length>=9) till.d = tillAsked.substring(8,10);
							 till.date = new Date(till.y,till.m-1,till.d);
		
	for (var i in events){
		var eventDateStart = new Date (events[i].start.date.substring(0,4),
									   events[i].start.date.substring(5,7)-1,
									   events[i].start.date.substring(8,10));
		if(eventDateStart>=from.date && eventDateStart<=till.date) result.push (events[i]);
		}
	
	return result;
	}



	
/*
 * updateEventsDuration calculates duration of all events
 * params: array of events, google style
 * returns: array of events, google style, with property duration containing the result for each event
 * 
 */	
this.updateEventsDuration = function (events) {

	// parse a date based on a dateDay field (e.g. 2011-09-03) and a dateTime field (e.g. 09:30)
	var parseDate = function (dateDay, dateTime) {
		var dateDay = dateDay.split('-');
		var dateTime = dateTime.split(':');
		var fullDate = dateDay.concat(dateTime).map( function( num ) { return parseInt( num, 10 ) } );
	 
		return new Date(fullDate.shift(), fullDate.shift(), fullDate.shift(), fullDate.shift(), fullDate.shift());
		};
	 
	// calculate the difference between two dates in hours
	var dateDiff = function (startDate, endDate){
		var diff = endDate - startDate;
		return diff / ( 1000 * 60 *60 );
		};


	for (var i in events){
		if (events[i].start.hasOwnProperty("dateTime")){
			// this is a non-whole day event. we need to add there date and time props
			events[i].start.date = events[i].start.dateTime.substring(0,10);
			events[i].start.time = events[i].start.dateTime.substring(11,16);
			events[i].end.date = events[i].end.dateTime.substring(0,10);
			events[i].end.time = events[i].end.dateTime.substring(11,16);
			
			events[i].duration=dateDiff(parseDate(events[i].start.date,events[i].start.time), 
									 		 parseDate(events[i].end.date,events[i].end.time));
		} else {
			// this is a whole-day event
			events[i].duration=dateDiff(parseDate(events[i].start.date,"00:00"), 
			 		 						 parseDate(events[i].end.date,"00:00")); 
		}
	}
	return events;}
	
	
this.updateEventColor = function (events) {
	for (var i in events){	if (events[i].colorId == null) events[i].colorId = 0; }
	return events;}





/*
 * updateTotalBusyHours, joining all selected calendars
 * params: array of calendars, google style. array of selected calendars
 * returns: array of objects hours busy  
 * each object gives busy hours for one date. dates are unique
 * [{'date':'yyyy-mm-dd', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0] }, ... ]
 * 
 */
this.updateTotalBusyHours = function (calendars, selected) {
	
	var ttlbzyhrs = [];
	
	
//	ttlbzyhrs.push({'date':'date', 'hours':'hours', 'hoursByColor':[] });
	
	var pushNeeded=true;
	
	for (var k in calendars){ if (selected[k]){
		
//		ttlbzyhrs[0].hoursByColor[k]=calendars[k].summary;
		
		for (var i in calendars[k].busyHours){
			
			for (var j in ttlbzyhrs){
				if (calendars[k].busyHours[i].date == ttlbzyhrs[j].date) {
					
					
					ttlbzyhrs[j].hours += calendars[k].busyHours[i].hours
					
					//if (appModel.colorMonth=="byCalendars"){
					
						ttlbzyhrs[j].hoursByColor[k] += calendars[k].busyHours[i].hours;
					//}
					
					/*
					if (appModel.colorMonth=="byEvents"){
						
					
						for (var l in ttlbzyhrs[j].hoursByColor){
							ttlbzyhrs[j].hoursByColor[l] += calendars[k].busyHours[i].hoursByColor[l];
						}
					}*/
					
					pushNeeded = false;
					break;
					
					} else {
	
					if (j==ttlbzyhrs.length-1)pushNeeded = true;
	
					}
				}
			
			if (pushNeeded) {
				ttlbzyhrs.push({'date':'', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0] });
				
				ttlbzyhrs[ttlbzyhrs.length-1].date = calendars[k].busyHours[i].date;
				ttlbzyhrs[ttlbzyhrs.length-1].hours = calendars[k].busyHours[i].hours;
				
				//if (appModel.colorMonth=="byCalendars"){
					
					ttlbzyhrs[ttlbzyhrs.length-1].hoursByColor[k] = calendars[k].busyHours[i].hours;
				//}
				
				/*
				if (appModel.colorMonth=="byEvents"){
					
					for (var l in ttlbzyhrs[ttlbzyhrs.length-1].hoursByColor){
					ttlbzyhrs[ttlbzyhrs.length-1].hoursByColor[l] = calendars[k].busyHours[i].hoursByColor[l];
					}
				}*/
				
				}
			
		}}}
	
	return ttlbzyhrs;
	
}




/*
 * updateBusyHours in one calendar
 * params: array of events, google style
 * returns: array of objects hours busy  
 * each object gives busy hours for one date. dates are unique
 * [{'date':'yyyy-mm-dd', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0] }, ... ]
 * 
 */
this.updateBusyHours = function (events) {
	
	var busyHours = [];
/*	busyHours.push({'date':'date', 'hours':'hours', 'hoursByColor':['default',
									                'light-blue',
									                'light-green',
									                'violet',
									                'light-red',
									                'gold',
									                'orange',
									                'turquoise',
									                'grey',
									                'blue',
									                'green',
									                'red'] });
	*/
	var pushNeeded=true;
	
	for (var i in events){	if (events[i].duration<24){
		
		for (var j in busyHours){
			if (events[i].start.date == busyHours[j].date) {
				
				
				busyHours[j].hours += events[i].duration;
				busyHours[j].hoursByColor[events[i].colorId] += events[i].duration;
				
				pushNeeded = false;
				break;
				
				} else {

				if (j==busyHours.length-1)	pushNeeded = true;

				}
			}
		
		if (pushNeeded) {
			busyHours.push({'date':' ', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0] });
			
			busyHours[busyHours.length-1].date = events[i].start.date;
			busyHours[busyHours.length-1].hours = events[i].duration;
			busyHours[busyHours.length-1].hoursByColor[events[i].colorId] = events[i].duration;
			
			}
		
	}}
	
	
	return busyHours;
	
}
	
/*****************************************  
    Observable implementation    
*****************************************/
/*
 * Noone really listens to it nowdays
 * see AppModel for explanations
 * 
this._observers = [];

this.addObserver = function(observer) {
	this._observers.push(observer);
}

this.notifyObservers = function(what,k) 
{
	for(var i in this._observers) 
	{
		this._observers[i].update(what,k);
	}	
}*/
	
}
