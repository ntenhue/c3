/*
 * Calendar Model
 * Contains all data and performs methods over it
 * 
 */

function CalendarModel(appModel){
	this.calendars= [];
	this.totalBusyHours = []; 
	this.colors = [];
	
	this.colorspaceForEvents = ["#000000","#b9cde5","#99ffcc","#b3a2c7","#ff7c80","#f9d161","#feb46a","#00b0f0","#d9d9d9", "#4f81bd", "#00b050", "#c00000"];
	



/***************************************************************************
 * SETTERS
 **************************************************************************/

this.addCalendars = function (items) {	
	for (var i in items){
		items[i].events = [];
		items[i].updated = "";
		items[i].busyHours = [];
		items[i].selected = items[i].selected==true?true:false; //if null then override with false
		}
	
	//for(var i in items) {if (items[i].summary == "Hands on the right place" || items[i].summary == "Angie"){items.splice(i,1);	}}
	
	
	this.calendars = this.calendars.concat(items);
	this.calendars = this.sortCalendars(this.calendars);
	
	for(var i in this.calendars)this.colors[i] = this.calendars[i].backgroundColor;
	

	appModel.setCldrStatus(null,"initiated", this.calendars.length);
	
	for(var i in this.calendars){appModel.setSelectedCldrs(i,this.calendars[i].selected);}
	appModel.setCalendarsLoaded(true); // this will trigger the observer of app model
	}


this.addEvents = function (k, items, upd, nextPageToken) {	
	var last = items[items.length-1].start;
	if (last.date == null)last.date = last.dateTime.substring(0,10);
	appModel.setCldrStatus(k,"<br>loading events... "+last.date);
	
	if (this.calendars[k].updated==""){ // new pack of events
		
		for (var i=0; i<items.length; i++){	if (items[i].status == "cancelled"){items.splice(i,1); i--; }}
		this.calendars[k].events = this.calendars[k].events.concat(items);	
		
	}else{	//updates		
		
		for (var i in items){
			
			
			var found = false;
			for (var j=0; j<this.calendars[k].events.length; j++){
				if (this.calendars[k].events[j].id == items[i].id){
					
					
					if (this.calendars[k].events[j].linkedFrom!= null){
						this.calendars[k].events.splice(j,1);
					}else{	
						this.calendars[k].events[j] = items[i]; 
						if (items[i].status == "cancelled"){this.calendars[k].events.splice(j,1); j--;}
						found = true;
					}
					}
			}
			if (!found && items[i].status != "cancelled")this.calendars[k].events.push(items[i]);
		}
		
	}
	
	if (nextPageToken==null){
		// if this is a last or the only page of events
		this.calendars[k].updated= upd;
		this.calendars[k].events = this.fillEmptyValues(this.calendars[k]);
		this.calendars[k].events = this.splitEvents(this.calendars[k].events);
		this.calendars[k].events = this.filterEvents(this.calendars[k].events);
		this.calendars[k].busyHours = this.updateBusyHours(this.calendars[k]);
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
	appModel.setCldrStatus(null,"cleared", this.calendars.length);
	appModel.setCalendarsLoaded(false);	
	}	

this.clearEvents = function (k) {	
	this.calendars[k].events=[];
	this.calendars[k].updated = "";
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
	if (events == null)return null;
	
	
	if (tillAsked == null)tillAsked=fromAsked;
	var result=[];
	
	
	var from = {"y":0,"m":0,"d":0}
	var till = {"y":9999,"m":99,"d":99}
	
	var onedash = fromAsked.indexOf("-");
	var twodash = fromAsked.substring(onedash+1).indexOf("-");

	if (onedash!=-1){	
		if (twodash!=-1){
			//year month day
			from.y = fromAsked.substring(0,onedash);
			from.m = fromAsked.substring(onedash+1,twodash+onedash+1);
			from.d = fromAsked.substring(twodash+1+onedash+1);			
		}else{
			//year month
			from.y = fromAsked.substring(0,onedash);
			from.m = fromAsked.substring(onedash+1);
			from.d = 01;
		}	
	}else{
		// year	
		from.y = fromAsked;
		from.m = 01;
		from.d = 01;
	}
	
	var onedash = tillAsked.indexOf("-");
	var twodash = tillAsked.substring(onedash+1).indexOf("-")

	if (onedash!=-1){	
		if (twodash!=-1){
			//year month day
			till.y = tillAsked.substring(0,onedash);
			till.m = tillAsked.substring(onedash+1,twodash+onedash+1);
			till.d = tillAsked.substring(twodash+1+onedash+1);			
		}else{
			//year month
			till.y = tillAsked.substring(0,onedash);
			till.m = +tillAsked.substring(onedash+1)+1;
			till.d = 00;
		}	
	}else{
		// year	
		till.y = +tillAsked+1;
		till.m = 01;
		till.d = 00;
	}
	
	from.date = new Date(from.y,from.m-1,from.d);
	till.date = new Date(till.y,till.m-1,till.d);
	
	
	for (var i in events){
		var eventDateStart = new Date (events[i].start.date.substring(0,4),
				   				       events[i].start.date.substring(5,7)-1,
				   					   events[i].start.date.substring(8,10));
		if(eventDateStart>=from.date && eventDateStart<=till.date) result.push (events[i]);
		}

	return result;
	}




	
	
this.fillEmptyValues = function (calendar) {
	var events = calendar.events;
	
	
	
	for (var i in events){	
		if (events[i].colorId == null || events[i].colorId == 0) {
			events[i].colorId = 0; 
			events[i].color = calendar.backgroundColor; 
			}else{
			events[i].color = this.colorspaceForEvents[events[i].colorId];
			}
		
		

		events[i].allDayEvent = (events[i].start.dateTime == null);	
		if (events[i].allDayEvent){
		events[i].start.time = "00:00";
		events[i].end.time = "00:00";			
		}else{
		// this is a non-whole day event. we need to add there date and time props
		events[i].start.date = events[i].start.dateTime.substring(0,10);
		events[i].start.time = events[i].start.dateTime.substring(11,16);
		events[i].end.date = events[i].end.dateTime.substring(0,10);
		events[i].end.time = events[i].end.dateTime.substring(11,16);
		}
		events[i].duration=(new Date(Date.parse(events[i].end.date   + "T" + events[i].end.time  )) -
							new Date(Date.parse(events[i].start.date + "T" + events[i].start.time)) ) 
							/ ( 1000 * 60 *60 );
		
		if (events[i].linkedTo == null && events[i].linkedFrom == null)events[i].durationUnsplit = events[i].duration;
		
		if (events[i].summary == null) events[i].summary = ""; 
		events[i].filterPassed = false; 
		
		}
	
	return calendar.events;}



this.splitEvents = function (events) {
	events.forEach(function(d,i) {
	if(d.start.date != d.end.date && d.end.time!="00:00" && d.start.dateTime!=null && d.linkedTo==null	){
		var newEvent = $.extend(true, {}, d);;
		newEvent.start.date = newEvent.end.date;
		newEvent.start.time = "00:00";
		newEvent.start.dateTime=newEvent.end.date+"T00:00"+newEvent.start.dateTime.substring(16);
		newEvent.duration =(new Date(Date.parse(newEvent.end.dateTime.substring(0,16))) -
							new Date(Date.parse(newEvent.start.dateTime.substring(0,16)))) / ( 1000 * 60 *60 );
		newEvent.linkedFrom = i;
		events.push(newEvent);
		
		
		d.end.time = "00:00";
		d.end.dateTime=d.end.date+"T00:00"+d.end.dateTime.substring(16);
		d.duration =(new Date(Date.parse(d.end.dateTime.substring(0,16))) -
					 new Date(Date.parse(d.start.dateTime.substring(0,16)))) / ( 1000 * 60 *60 );
		d.linkedTo = events.length-1;
	}});

	return events;}



/*
 * updateTotalBusyHours, joining all selected calendars
 * params: array of calendars, google style. array of selected calendars
 * returns: array of objects hours busy  
 * each object gives busy hours for one date. dates are unique
 * [{'date':'yyyy-mm-dd', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0] }, ... ]
 * 
 */
/*
this.updateTotalBusyHours = function (calendars, selected) {
	
	var ttlbzyhrs = [];
	
	for ( var int = 0; int < calendars.length; int++) {
		if (!selected[int]) {
			continue;
		}
		var busyHours = this.updateBusyHoursAsMap(calendars[int]);
		for ( var int2 = 0; int2 < Object.keys(busyHours).length; int2++) {
			var key = Object.keys(busyHours)[int2];
			if (ttlbzyhrs[key] == null) {
				ttlbzyhrs[key] = busyHours[key];
			} else {
				ttlbzyhrs[key].hours += busyHours[key].hours;
				ttlbzyhrs[key].filterPassed |= busyHours[key].filterPassed; 
				for ( var int3 = 0; int3 < Object.keys(ttlbzyhrs[key].hoursByColor).length; int3++) {
					var colorKey = Object.keys(ttlbzyhrs[key].hoursByColor)[int3];
					ttlbzyhrs[key].hoursByColor[colorKey] += busyHours[key].hoursByColor[colorKey];
				}
			}
		}
	}
	
	return this.convertBusyHoursMapToArray(ttlbzyhrs);;
	
}

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
					ttlbzyhrs[j].hours += calendars[k].busyHours[i].hours;
					ttlbzyhrs[j].hoursByColor[k] += calendars[k].busyHours[i].hours;
					ttlbzyhrs[j].filterPassed |= calendars[k].busyHours[i].filterPassed;
					
					ttlbzyhrs[j].filterPassedByColor[k] |= calendars[k].busyHours[i].filterPassed;
					
					pushNeeded = false;
					break;
				} else {
					if (j==ttlbzyhrs.length-1)pushNeeded = true;
				}
			}

			if (pushNeeded) {
				ttlbzyhrs.push({'date':'', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0], 'filterPassed':false, 'filterPassedByColor':[false,false,false,false,false,false,false,false,false,false,false,false], });

				ttlbzyhrs[ttlbzyhrs.length-1].date = calendars[k].busyHours[i].date;
				ttlbzyhrs[ttlbzyhrs.length-1].hours = calendars[k].busyHours[i].hours;
				ttlbzyhrs[ttlbzyhrs.length-1].hoursByColor[k] = calendars[k].busyHours[i].hours;
				ttlbzyhrs[ttlbzyhrs.length-1].filterPassed = calendars[k].busyHours[i].filterPassed;
				ttlbzyhrs[ttlbzyhrs.length-1].filterPassedByColor[k] = calendars[k].busyHours[i].filterPassed;
				}

		}}}

	return ttlbzyhrs;

}



this.filterEvents = function (events) {
for (var i in events){
	events[i].filterPassed = true &
	 (
		 ( appModel.searchCaseSensitive)&
		  		(events[i].summary.indexOf(appModel.searchString.trim()) !== -1)
		 |(!appModel.searchCaseSensitive)&
				(events[i].summary.toLowerCase().indexOf(appModel.searchString.toLowerCase().trim()) !== -1)
		 |(appModel.searchString == "")
	 )
	 &
	 (
		  (events[i].duration>=appModel.searchDurationMin)
	     &(events[i].duration<=appModel.searchDurationMax)
	 )
	 &
	 (
		  // this.colorspaceForEvents[events[i].colorId]
		   appModel.searchColors[events[i].colorId]
	 );	
}
return events; }//function

/*
 * updateBusyHours in one calendar
 * params: array of events, google style
 * returns: array of objects hours busy  
 * each object gives busy hours for one date. dates are unique
 * [{'date':'yyyy-mm-dd', 'hours':0, 'hoursByColor':[0,0,0,0,0,0,0,0,0,0,0,0] }, ... ]
 * 
 */
this.updateBusyHours = function (calendar) {
	
	return this.convertBusyHoursMapToArray(this.updateBusyHoursAsMap(calendar));
}

this.updateBusyHoursAsMap = function (calendar) {
	var busyHours = [];
	var events = calendar.events;
	
	for (var i in events){	if (events[i].duration<24){

		if (!appModel.searchHideFiltered || events[i].filterPassed){
			
			if (busyHours[events[i].start.date] == null) {
				var busyHour = new Object();
				busyHour.hours = events[i].duration;
				var hoursByColor=[0,0,0,0,0,0,0,0,0,0,0,0];
				busyHour.hoursByColor = hoursByColor;
				busyHour.hoursByColor[events[i].colorId] = events[i].duration;
				busyHour.date = events[i].start.date;
				busyHour.filterPassed = events[i].filterPassed;
				busyHour.filterPassedByColor=[0,0,0,0,0,0,0,0,0,0,0,0]; 
				busyHour.filterPassedByColor[events[i].colorId] = events[i].filterPassed;
				busyHours[events[i].start.date] = busyHour;
			} else {
				busyHours[events[i].start.date].filterPassed |= events[i].filterPassed;
				busyHours[events[i].start.date].filterPassedByColor[events[i].colorId] |= events[i].filterPassed;
				busyHours[events[i].start.date].hours += events[i].duration;
				busyHours[events[i].start.date].hoursByColor[events[i].colorId] += events[i].duration;		
			}
			
		}//searchHideFiltered
	}}
	
	return busyHours;
}


this.convertBusyHoursMapToArray = function(busyHoursMap) {
	var busyHoursArray = [];
	
	for ( var int = 0; int < Object.keys(busyHoursMap).length; int++) {
		var key = Object.keys(busyHoursMap)[int];
		busyHoursArray.push(busyHoursMap[key]);
	}
	
	return busyHoursArray;
}
	

}
