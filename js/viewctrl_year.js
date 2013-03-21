var tooltip;
function yearView(selected, monthColors, callback) {
	
	$("#yearViewCanvas").empty();
	
	var width = 970, height = 166, cellSize = 17; 
	var day = d3.time.format("%w"), 
	week = d3.time.format("%U"), 
	weekSun = d3.time.format("%W"),
	year = d3.time.format("%Y"),
	format = d3.time.format("%Y-%m-%d");
	
	var color = d3.scale.quantize() 
		.domain([ 0.0, 12.0 ]) 
		.range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
	
	var svg = d3.select("#yearViewCanvas").selectAll("svg")
		.data([ appModel.yearFirst, appModel.yearLast ])
		.enter().append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "RdYlGn") 
		.append("g")
		.attr( "transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")")
		.attr("id", function(d) { return "year" + d; }); 
	
	svg.append("text")
		.attr("transform" , "translate(-25," + cellSize * 3.5 + ")rotate(-90)")
		.style("text-anchor", "middle")
		.text(function(d) {return d;});


	var dateLabel = svg.selectAll(".label")
		.data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("text") 
		.attr("class", "label") 
		.attr("x",function(d){
			return weekSun(d) * cellSize;
		})
		.attr("y", function(d) {
			if (day(d) == 0) {
				return 6 * cellSize;
			} else if (day(d) > 0) {
				return (day(d) - 1) * cellSize;
			}
		}) 
		.attr("transform", "translate(9,12)")
		.style("text-anchor", "middle")
		.text( function(d) { return d3.time.format("%d")(d); }); 
		
	var dateLabelGrey = svg.selectAll(".labelGrey")
		.data(function(d) { return d3.time.days( d3.time.monday(new Date(d,0,1)),new Date(d,0,1) ); })
		.enter().append("text") 
		.attr("class", "labelGrey") 
		.attr("x",function(d){
			return 0* cellSize;
		})
		.attr("y", function(d) {
			if (day(d) == 0) {
				return 6 * cellSize;
			} else if (day(d) > 0) {
				return (day(d) - 1) * cellSize;
			}
		}) 
		.attr("transform", "translate(9,12)")
		.style("text-anchor", "middle")
		.text( function(d) { return d3.time.format("%d")(d); }); 

	var dateLabelGreyEnd = svg.selectAll(".labelGreyEnd")
		.data(function(d) { return d3.time.days( new Date(d+1,0,1),d3.time.monday(new Date(d+1,0,8)) ); })
		.enter().append("text") 
		.attr("class", "labelGrey") 
		.attr("x",function(d){
			return weekSun(new Date(year(d),0,0)) * cellSize;
		})
		.attr("y", function(d) {
			if (day(d) == 0) {
				return 6 * cellSize;
			} else if (day(d) > 0) {
				return (day(d) - 1) * cellSize;
			}
		}) 
		.attr("transform", "translate(9,12)")
		.style("text-anchor", "middle")
		.text( function(d) { return d3.time.format("%d")(d); }); 

	var weekdayLabel = svg.selectAll(".weekdayLabel")
		.data(function(d) { return d3.time.days( d3.time.monday(new Date(d,0,1)),d3.time.monday(new Date(d,0,8)) ); })
		.enter().append("text") 
		.attr("class", "weekdayLabel") 
		.attr("x",0)
		.attr("y", function(d) {
			if (day(d) == 0) {
				return 6 * cellSize;
			} else if (day(d) > 0) {
				return (day(d) - 1) * cellSize;
			}
		}) 
		.style("text-anchor", "middle")
		.attr("transform", "translate(-11,12)")
		.text( function(d) { return d3.time.format("%a")(d); });
		
	var weeknumberLabel = svg.selectAll(".weeknumberLabel")
		.data(function(d) { return d3.time.weeks( new Date(d,0,1), new Date(d+1,0,1) ).concat([new Date(d+1,0,0)]); })
		.enter().append("text") 
		.attr("class", "weeknumberLabel") 
		.attr("x",function(d){
			return weekSun(d) * cellSize;
		})
		.attr("y",0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(9,-3)")
		.text( function(d) { return +weekSun(d)+1 ; });
			
	var weeknumberText = svg.append("text") 
		.attr("class", "weeknumberLabel") 
		.style("text-anchor", "middle")
		.attr("transform", "translate(-10.5,-3)")
		.text("Week");

	var rect = svg.selectAll(".day")
		.data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("rect") 
		.attr("class", "day")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("style:opacity","0.8")
		.attr("x",function(d){
			return weekSun(d) * cellSize;
		})
		.attr("y", function(d) {
					if (day(d) == 0) {
						return 6 * cellSize;
					} else if (day(d) > 0) {
						return (day(d) - 1) * cellSize;
					}
				}) 
		.datum(format);
	
	var monthPath = svg.selectAll(".month")
		.data(function(d) {	return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("path")
		.attr("class", "month")
		.attr("d", monthPath);
	
	var monthLabel = svg.selectAll(".monthLabel")
		.data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("text")
		.attr("class", "monthLabel")
		.style("text-anchor", "middle")
		.attr("x", monthLabelPositionX)
		.attr("y", -20)
		.attr("yearNumber", function(d) { return d3.time.format("%Y")(d);})
		.attr("monthNumber", function(d) { return d3.time.format("%m")(d); })
		.text(function(d) { return d3.time.format("%b")(d) });
	
/* ---- functions ---- */

		function monthLabelPositionX(t0) {
			var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), d0 = +day(t0), w0 = +week(t0), d1 = +day(t1), w1 = +week(t1);
			if (d0 == 0) {
				return (w0 + w1 + 1) / 2 * cellSize;
			} else if (d0 > 0) {
				return (w0 + 1 + w1 + 1) / 2 * cellSize;
			}
		}
		
		function monthPath(t0) { 
		
			var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), 
				d0 = +day(t0), //w0 = +week(t0), 
				d1 = +day(t1), //w1 = +week(t1);
				w0 = +weekSun(t0),
				w1 = +weekSun(t1); 

			/*
			if (d0 == 0) {
				return "M" + w0 * cellSize + "," + 6 * cellSize + "H" + (w0 - 1)
						* cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize + "V"
						+ d1 * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0 + "H"
						+ w0 * cellSize + "Z";
			*/
			if (d0 == 0) {
				return "M" + (w0+1) * cellSize + "," + 6 * cellSize + "H" + w0
						* cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize + "V"
						+ d1 * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0 + "H"
						+ (w0+1) * cellSize + "Z";
			} else if (d0 > 0 && d1 !== 0) {
				return "M" + (w0 + 1) * cellSize + "," + (d0 - 1) * cellSize + "H"
						+ w0 * cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize
						+ "V" + d1 * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0
						+ "H" + (w0 + 1) * cellSize + "Z";
			} else if (d0 > 0 && d1 == 0) {
				return "M" + (w0 + 1) * cellSize + "," + (d0 - 1) * cellSize + "H"
						+ w0 * cellSize + "V" + 7 * cellSize + "H" + (w1+1) * cellSize
						+ "V" + d1 * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0
						+ "H" + (w0 + 1) * cellSize + "Z";
						
			}

		}
		
	

/* ---- Import the events on date Data ---- */

	var data = d3.nest() 
		.key(function(d) { return d.date; }) 
		.rollup(function(d) { return d[0].hours; }) 
		.map(calendarModel.totalBusyHours); 

		rect.filter(function(d) { return d in data;}) 
			.attr("class", function(d) { return "day " + color(data[d]);})
			.attr("busyHours",function(d){ return data[d]; })
			.attr("date",function(d){ return d; } )
			.append("svg:title")
			.text(function(d){ return data[d] + " hours of events on the day." });


	
	d3.select(self.frameElement).style("height", "2910px");
	
	// tooltip
	if (tooltip == null) {		
		tooltip = d3.select("body")
		.append("div")
		.attr("class", "tooltip")
		.html(TOOLTIP_TABLE_HTML);
		
		// apply close button
		var table = document.getElementById("tooltiptable");
		$(table).addClass("tooltipTable");
	}
	
	$(".monthLabel").bind('mouseenter mouseout click', function() {monthLabelController(this, event, selected, monthColors);});
	$(".day").bind('mouseenter mouseout click', function() {
		var allEventsForTheDay = [];
		for ( var s = 0; s < selected.length; s++) {
			if (selected[s] == true) {
				var events = calendarModel.getEventsInRange(calendarModel.getEvents(s), this.__data__);
				// add color information
				var wrappers = [];
				for ( var int = 0; int < events.length; int++) {
					var wrapper = new Object();
					wrapper.data = events[int];
					wrapper.color = calendarModel.colors[s];
					wrappers.push(wrapper);
				}
				allEventsForTheDay = allEventsForTheDay.concat(wrappers);
			}
		}
		allEventsForTheDay.sort(function(a, b){
			if (a.data.start.dateTime == null) {
				return 1;
			} else if (b.data.start.dateTime == null) {
				return -1;
			}
			var date1 = new Date(a.data.start.dateTime);
			var date2 = new Date(b.data.start.dateTime);
			return date1 < date2 ? -1 : 1;
			
		});
		return dayController(this, allEventsForTheDay, event, tooltip);
	});
	
	callback();
	
}

/* ---- Controllers ---- */

function yearViewUpdate() {
	var see = 0;
	appModel.setWorkingStatus("updating year view...");
	yearView(appModel.selectedCldrs, calendarModel.colors, function(){appModel.setWorkingStatus("");});	

}

/*
 * Controller function for monthLabel logic.
 * Params:
 * monthLabel: the label itself
 * event: event type
 * k: ?
 * selected: the array is selected calendars
 * monthColors: the array of available colors for months
 */
function monthLabelController(monthLabel, event, selected, monthColors) {
	if (event.type == "mouseover") {		
		$(monthLabel).css("cursor", "pointer");
		$(monthLabel).css("fill","#559393");
	} else if (event.type == "mouseout") {
		$(monthLabel).css("fill","");
	} else if (event.type == "click") {
		$(monthLabel).css("fill","#559393");
		appModel.selectedYear=+monthLabel.attributes.yearNumber.value;
		appModel.selectedMonth=+monthLabel.attributes.monthNumber.value;
		monthView = new MonthView(selected,
			+monthLabel.attributes.yearNumber.value,
			+monthLabel.attributes.monthNumber.value,
			monthColors,
		function(){});
	}
}

function dayController(day, events, mouseEvent, tooltip) {
	
	if (mouseEvent.type == "mouseover") {
		$(day).css('stroke','#444444');
	} else if (mouseEvent.type == "mouseout") {
		$(day).css('stroke',"");
	} else if (mouseEvent.type == "click" && events != null && events.length  > 0) {
		// add tooltip
		tooltip.transition()        
			.duration(500)      
			.style("visibility", "visible");      
		tooltip.style("left", (mouseEvent.pageX) + "px")
			.style("top", (mouseEvent.pageY - 28) + "px");  
		buildTooltipHTML(events, tooltip);
	}
}

function closeTooltip() {
	tooltip.transition()        
		.duration(500)  
		.style("visibility", "hidden");
}

function buildTooltipHTML(wrappers, tooltip) {
	var table = document.getElementById("tooltiptable");
	var tbody = document.createElement('tbody');
	for ( var i = 0; i < wrappers.length; i++) {
		var event = wrappers[i].data;
		var row = tbody.insertRow(i);
		$(row).addClass("tooltipTableRow");
		var data1 = row.insertCell(0);
		$(data1).addClass("leftTooltipColumn");
		var img = document.createElement("img");
		img.src = "img/tooltip_img.png";
		data1.appendChild(img);
		var a = document.createElement('a');
		a.href = event.htmlLink;
		var text = document.createTextNode(event.summary);
		a.appendChild(text);
		data1.appendChild(a);
		data1.style.color = wrappers[i].color;
		var data2 = row.insertCell(1);
		$(data2).addClass("rightTooltipColumn");
		if (event.start != null && event.end != null) {			
			data2.appendChild (document.createTextNode(event.start.time + " - " + event.end.time))
		}
		data2.style.color = wrappers[i].color;
	}
	table.tBodies[0].parentNode.replaceChild(tbody, table.tBodies[0]);
	if ($('#img_close_box').length == 0) {		
		var a = document.createElement('a');
		var img = document.createElement("img");
		img.src = "img/tooltip_img.png";
		a.appendChild(img);
		a.id = "img_close_box";
		a.href = "javascript:closeTooltip()";
		$(a).addClass("tooltipCloseButton");
		$(table).append(a);
		tooltip.html(table.outerHTML);
	}
    
}

