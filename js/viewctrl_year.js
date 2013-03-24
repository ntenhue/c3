var tooltip;
function yearView(selected, colorspace, callback) {
	
	
	var colorspace1 = colorspace;
	if (appModel.complexity == "complex") {

	// single or multiple calendars selected
	var k = null;
	for ( var int in selected) {
		if (k != null && selected[int] == true) {k = null;	break;	}
		if (selected[int] == true) {	k = int; }
		}

		if (k!=null) {	
		colorspace1 = [colorspace[k],"#b9cde5","#99ffcc","#b3a2c7","#ff7c80","#f9d161","#feb46a","#00b0f0","#d9d9d9", "#4f81bd", "#00b050", "#c00000"];
		
		}
	}
	
	var color = d3.scale.ordinal().range(colorspace1);
	
	
	
	$("#yearViewCanvas").empty();
	
	var width = 970, height = 186, cellSize = 17; 
	var day = d3.time.format("%w"), 
	week = d3.time.format("%U"), 
	weekSun = d3.time.format("%W"),
	year = d3.time.format("%Y"),
	format = d3.time.format("%Y-%m-%d");
	
	var heatmap = d3.scale.quantize() 
		.domain([ appModel.lightestColorForHours, appModel.strongestColorForHours]) 
		.range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));
	

	var svg = d3.select("#yearViewCanvas").selectAll("svg")
		.data([ appModel.yearFirst , appModel.yearLast])
		.enter().append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "RdYlGn") 
		.append("g")
		.attr( "transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")")
		.attr("id", function(d) { return "year" + d; }); 
	
	var yearLabel = svg.append("text")
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
		.text( function(d) { return d3.time.format("%a")(d).substring(0,2); });
		
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
		.data(function(d) { 
			return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); 
			})
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
		
	
if (appModel.complexity == "simple") {
/* ---- Import the events on date Data ---- */
	var data = d3.nest() 
		.key(function(d) { return d.date; }) 
		.rollup(function(d) { return {hours:d[0].hours, filterPassed:d[0].filterPassed}; }) 
		.map(calendarModel.totalBusyHours); 
	
		rect.filter(function(d) { return d in data;}) 
		.attr("class", function(d) { 
			if(data[d].filterPassed){ 
				return "day activeday " + heatmap(data[d].hours)
			} else{ 
				return "day activeday filtered";
				}})
		//.attr("busyHours",function(d){ return data[d]; })
		.attr("date",function(d){ return d; } )
		.attr("id", function(d){return d;})
		.append("svg:title")
		.text(function(d){ return data[d].hours + " hours of events" });
	};

	
	
if (appModel.complexity == "complex") {
	
	var x = d3.scale.linear().rangeRound([cellSize, 0]).domain([0, cellSize]);
	 
	var data1 = [];
		if (k!=null) {	
			data1 = $.extend(true, [], calendarModel.calendars[k].busyHours);
		} else {
			data1 = $.extend(true, [], calendarModel.totalBusyHours);		
		}

	data1.forEach(function(d) {
		var x0 = 0;
		var x1 = 0;
		d.bricks = [];
			
		for (i in d.hoursByColor){
			d.bricks[i] = {filterPassed: d.filterPassedByColor[i], x0: x0, x1: x0 += Math.ceil(+d.hoursByColor[i]/d.hours*cellSize)};
			}
		});
	
	
 
	for ( var int = 0; int < svg[0].length; int++) {
		var block =d3.select('#' + svg[0][int].id).selectAll(".block")
		.data(data1)
		.enter()
		.append("g")
		.filter( function(d) {
			return new Date(Date.parse(d.date)).getFullYear() == svg[0][int].id.substring(4);
		})
		
		.attr("class", "day activeday")
		.attr("id", function(d){return d.date;}) //link to the tooltip
		.attr("transform", function(d){
			var xshift=0;
			var yshift=0;
			
			ye=d.date.substring(0,4);
			mo=d.date.substring(5,7);
			da=d.date.substring(8,10);
			
			temp = d3.time.days(new Date(ye, mo-1, da), new Date(ye, mo-1, +da+1))[0];
			
			xshift = (weekSun(temp)-1) * cellSize;
			
			if (day(temp) == 0) {	
				yshift = 6 * cellSize;
			} else if (day(temp) > 0) {
				yshift = (day(temp) - 1) * cellSize;
			}
			
			return "translate("+xshift+","+yshift+")";	
		})
		.attr("style:opacity",function(d){return (d.hours-appModel.lightestColorForHours)/(appModel.strongestColorForHours-appModel.lightestColorForHours);} );
		
		
		
		block.selectAll("g")
		.data(function(d) { return d.bricks; })
		.enter()
		.append("rect")
		.attr("height", cellSize)
		.attr("x", function(d) { return x(1-d.x0); })
		.attr("width", function(d) { return x(d.x0) - x(d.x1); })
		.style("fill", function(d,i) { return d.filterPassed? color.range()[i] : "#EEE";	});
	}//for
	
	
}
	




d3.select(svg[0][0]).append("text")
	.attr("class", "complexLabel")
	.attr("x", width-140)
	.attr("y", -50)
	.attr("height", 30)
	.attr("width", 100)
	.style("fill",(appModel.complexity == "simple")? "red" : "black" )
	.text("simple");

	
d3.select(svg[0][0]).append("text")
	.attr("class", "complexLabel")
	.attr("x", width-100)
	.attr("y", -50)
	.attr("height", 30)
	.attr("width", 100)
	.style("fill",(appModel.complexity == "complex")? "red" : "black" )
	.text("complex");
	

	


	
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
	
	$(".monthLabel").bind('mouseenter mouseout click', function() {monthLabelController(this, event, selected, colorspace);});
	$(".activeday").bind('mouseenter mouseout click', function() {
		if (event.type == "click") {
		
		var allEventsForTheDay = [];
		for ( var s = 0; s < selected.length; s++) {
			if (selected[s] == true && (appModel.cldrStatus[s] == "updated" || appModel.cldrStatus[s] == "events added")) {
				var events = calendarModel.getEventsInRange(calendarModel.getEvents(s), this.id /*__data__*/);
				// add color information
				var wrappers = [];
				for ( var int = 0; int < events.length; int++) {
					var wrapper = new Object();
					wrapper.data = events[int];
					
					if (events[int].filterPassed){
						wrapper.color = k==null? colorspace[s] : events[int].color;
					}else{
						wrapper.color = "#EEE";
					}
					
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
	}
		return dayController(this, allEventsForTheDay, event, tooltip);
	
}
	);
	
	callback();

	
	
		
$(".complexLabel").bind('click', function() {switchComplexity(this, event);});
		
}







/* ---- Controllers ---- */


function switchComplexity(arg,event) {

	if (event.type == "click") {	

		if (arg.textContent=="simple"){ appModel.complexity = "simple";}
		if (arg.textContent=="complex"){ appModel.complexity = "complex";}
		
appView.update("complexity changed");
	}

}




function yearViewUpdate() {	
	
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
 * colorspace: the array of available colors for months
 */
function monthLabelController(monthLabel, event, selected, colorspace) {
	if (event.type == "mouseover") {		
		$(monthLabel).css("fill","#FF0000");
	} else if (event.type == "mouseout") {
		$(monthLabel).css("fill","");
	} else if (event.type == "click") {
		$(monthLabel).css("fill","#FF0000");
		appModel.selectedYear=+monthLabel.attributes.yearNumber.value;
		appModel.selectedMonth=+monthLabel.attributes.monthNumber.value;
		monthView = new MonthView(selected,
			+monthLabel.attributes.yearNumber.value,
			+monthLabel.attributes.monthNumber.value,
			colorspace,
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
		tooltip.style("left", (mouseEvent.pageX>800? mouseEvent.pageX-300:mouseEvent.pageX) + "px")
			.style("top", (mouseEvent.pageY - 0) + "px");  
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

		
		var link = document.createElement('a');
		$(link).attr("target", "_blank")
				.attr("href", event.htmlLink)
				.text(event.summary==""? "(no title)":event.summary);
		data1.appendChild(link);
		

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

