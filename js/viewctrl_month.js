function MonthView(selected, yearNumber, monthNumber, colorspace, callback){
	
	$("#monthViewCanvas").empty();
	
	var dateFormat = d3.time.format("%Y-%m-%d");
	var months = d3.time.format("%m");
	var dateNumber = d3.time.format("%d");
	
	var margin = {top: 20, right: 37, bottom: 30, left: 37},
	    width = 970 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
	    .rangeRound([height, 0]);
	
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(12);
	
	var xAxisGrid = d3.svg.axis()
	    .scale(x)
	    .ticks(5)
	    .orient("bottom");
	
	var yAxisGrid = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(12);

	
	var svg = d3.select("#monthViewCanvas").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	
	// single or multiple calendars selected
	var k = null;
	for ( var int = 0; int < selected.length; int++) {	
		if (k != null && selected[int] == true){k = null; break;}					
		if (selected[int] == true){k = int;}
		}

	var colorspace1 = colorspace;
	if (k!=null) {colorspace1 = [colorspace[k],"#b9cde5","#99ffcc","#b3a2c7","#ff7c80","#f9d161","#feb46a","#00b0f0","#d9d9d9", "#4f81bd", "#00b050", "#c00000"];}
	var color = d3.scale.ordinal().range(colorspace1);

	var data = [];
	var startPoint = yearNumber+"-"+(monthNumber<10?"0"+monthNumber:monthNumber); // date parser in firefox cannot do with 2013-2, he needs 2013-02
	var endPoint = yearNumber+"-"+(monthNumber<10?"0"+monthNumber:monthNumber);
	var cellsize = width/32;
	
	
		
	if (k!=null) {	
				if((appModel.selectedCldrs[k]) &&
		          !(appModel.cldrStatus[k].substring(0,8) == "<br>load"||
					appModel.cldrStatus[k] == "loading...")) {
		data = $.extend(true, [], calendarModel.getEventsInRange(calendarModel.calendars[k].events, startPoint, endPoint));}
	} else {
		for ( var k in selected) {	if((appModel.selectedCldrs[k]) &&
				          !(appModel.cldrStatus[k].substring(0,8) == "<br>load"||
							appModel.cldrStatus[k] == "loading...")) {
		data = data.concat(calendarModel.getEventsInRange(calendarModel.calendars[k].events, startPoint, endPoint));
		}}

		}
	
	var amonth = []; for(i=1;i<32;i++){amonth.push(i);}
	x.domain(amonth);
	y.domain([24,0]);
	
	svg.append("g")
	.attr("class", "grid")
	.attr("transform", "translate("+(cellsize/-2)+"," + height + ")")
	.call(xAxisGrid
			.tickSize(-height, 0, 0)
	        .tickFormat("")
	        );	
	
	svg.append("g")
	.attr("class", "grid")
	.call(yAxisGrid
			.tickSize(-width, 0, 0)
	        .tickFormat("")   );

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.append("text")
	.attr("x", width-15)
	.attr("dy", "-0.4em")
	.style("text-anchor", "end")
	.text("Date");


	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".3em")
		.style("text-anchor", "end")
		.text("Hours");

	
	var monthNameLabel = svg.append("text")
	.attr("transform" , "translate("+(width-20)+",60)")
	.attr("class","monthTitle")
	.text(d3.time.format("%B")(new Date(Date.parse(startPoint))));
		

	data = data.sort(function(a,b) {return b.durationUnsplit - a.durationUnsplit;});

	var eventsByDays = {};
	data.forEach(function(d) { if(!d.allDayEvent && (!appModel.searchHideFiltered || d.filterPassed)){
		if(eventsByDays[d.start.date]==null)eventsByDays[d.start.date]=[];
		d.parallelDepth = 1;
		d.parallelPosition = 1;
		eventsByDays[d.start.date].push(d);
		
		for(var int=0; int<eventsByDays[d.start.date].length-1; int++){
			if(!(Date.parse(d.end.dateTime)   <= Date.parse(eventsByDays[d.start.date][int].start.dateTime))
			 &&!(Date.parse(d.start.dateTime) >= Date.parse(eventsByDays[d.start.date][int].end.dateTime))){
				eventsByDays[d.start.date][eventsByDays[d.start.date].length-1].parallelDepth++;
				eventsByDays[d.start.date][int].parallelDepth++;
				eventsByDays[d.start.date][int].parallelPosition++;
			}
		}
	}});
	

	
	for (var day in eventsByDays){
	var stackD = 0;
	var stackP = 0;
	var stackC = 1;
		for (var fr in eventsByDays[day]){
			if(eventsByDays[day][fr].linkedTo!=null){
				var nextday = eventsByDays[day][fr].end.date;
				
				for(var to in eventsByDays[nextday]){
					if (eventsByDays[nextday][to].id == eventsByDays[day][fr].id){
						
						stackD += (eventsByDays[day][fr].parallelDepth + eventsByDays[nextday][to].parallelDepth) * stackC;
						eventsByDays[nextday][to].parallelDepth = stackD;
						eventsByDays[day][fr].parallelDepth = stackD;
						
						stackP += eventsByDays[day][fr].parallelPosition + eventsByDays[nextday][to].parallelPosition ;
						eventsByDays[nextday][to].parallelPosition = stackP;
						eventsByDays[day][fr].parallelPosition = stackP;
						
						stackC+=1;
						break; 
					}
				}
			}
		}	
	}
	
	
	for(day in eventsByDays){
		var eventRect = svg.selectAll(".eventRect")
		.data(eventsByDays[day])
		.enter()
		.append("rect")
		.attr("width", function(d) {return cellsize/d.parallelDepth*d.parallelPosition;})
		.attr("height", function(d) { return d.duration*60*height/1440; })
		.attr("y", function(d) { return (d.start.time.substring(0,2)*60+d.start.time.substring(3,5)*1)*height/1440; })
		.attr("x", function(d,i) { return (new Date(Date.parse(d.start.date)) - new Date(Date.parse(startPoint)))/1000/60/60/24*cellsize+cellsize-cellsize/d.parallelDepth*d.parallelPosition+cellsize*0.45; })
		.attr("style:opacity",1)
		.style("stroke",'#fff')
		.style("fill", function(d) { return d.filterPassed? d.color : "#EEE"; })
		.append("svg:title")
		.text(function(d){ return d.summary + " " + (d.start.time) + " - " + (d.end.time); });
			
		}
		

	

	

	if (k!=null) {	
		data = $.extend(true, [], calendarModel.calendars[k].busyHours);
	} else {
		data = $.extend(true, [], calendarModel.totalBusyHours);		
		}

		
	data.forEach(function(d) {
		var y0 = 0;
		d.bricks = [];	
		for (i in d.hoursByColor){d.bricks[i] = {filterPassed: d.filterPassedByColor[i], y0: y0, y1: y0 += d.hoursByColor[i]};}});

//	var amonth = []; for(i=1;i<32;i++){amonth.push(i);}
		  	
	var filteredForThisMonth = data
		.map(function(d) { if( months(dateFormat.parse(d.date)) == monthNumber 
						   && d3.time.format("%Y")(dateFormat.parse(d.date)) == yearNumber){
						   		return d; }})
		.filter(function(d){ if (typeof(d) == "object") { return d; }});
		  
//	x.domain(amonth);
//	y.domain([0, d3.max(filteredForThisMonth, function(d) { return d.hours; })]);		  
		

	
	/*
	var state = svg.selectAll(".state")
		.data(filteredForThisMonth)
		.enter()
		.append("g")
		.attr("class", "g")
		.attr("transform", function(d) { return "translate(" + dateNumber(dateFormat.parse(d.date))*20 + ",0)"; });
	
	state.selectAll("rect")
		.data(function(d) { return d.bricks; })
		.enter()
		.append("rect")
		.attr("width", 13)
		.attr("y", function(d) { return y(d.y1); })
		.attr("height", function(d) { return y(d.y0) - y(d.y1); })
		.style("fill", function(d,i) { return d.filterPassed? color.range()[i] : "#EEE"; });
		

	if (k!=null){	// set the Legend
		var legendComment = svg.append("g")
			.append("text")
			.attr("x", width-200)
			.attr("y", 0)
			.style("text-anchor", "start")
			.text("Colored by events");
	  	} // set the Legend

*/

	d3.select(self.frameElement).style("height", "2910px");
	callback();
	
}


function monthViewUpdate(){
	var see = 0;
	var k;
	for ( var i in appModel.selectedCldrs) {	if (appModel.selectedCldrs[i]) {	see++; k = i;	}	}

	if (see!=0 && appModel.selectedMonth!=null) {	
		if(see>1)k=null;
		appModel.setWorkingStatus("updating month view...");
		monthView = new MonthView (appModel.selectedCldrs,appModel.selectedYear,
									  appModel.selectedMonth, 
									  calendarModel.colors,
									  function(){appModel.setWorkingStatus("");	});
		}else{ 
		// slow call, not necessary
		$("#monthViewCanvas").empty();
		}
	
}






















