function yearView(k, selected,monthColors, callback) {
	
	$("#yearViewCanvas").empty();
	
	var width = 970, height = 186, cellSize = 17; 
	var day = d3.time.format("%w"), 
	week = d3.time.format("%U"), 
	weekSun = d3.time.format("%W"),
	year = d3.time.format("%Y"),
	format = d3.time.format("%Y-%m-%d");
	
	var color = d3.scale.quantize() 
		.domain([ 0.0, appModel.strongestColorForHours]) 
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
		
	

/* ---- Import the events on date Data ---- */

	var data = d3.nest() 
		.key(function(d) { return d.date; }) 
		.rollup(function(d) { return d[0].hours; }) 
		.map(calendarModel.totalBusyHours); 

	if (appModel.complexity == "simple") {
	
		rect.filter(function(d) { return d in data;}) 
			.attr("class", function(d) { return "day " + color(data[d]);})
			.attr("busyHours",function(d){ return data[d]; })
			.attr("date",function(d){ return d; } )
			.append("svg:title")
			.text(function(d){ return data[d] + " hours of events on the day." });

	};

	
	
if (appModel.complexity == "complex") {


	var data1 = [];
		if (k!=null) {	
			data1 = $.extend(true, [], calendarModel.calendars[k].busyHours);
			var color1 = d3.scale.ordinal()
								.range([monthColors[k],"#b9cde5","#99ffcc","#b3a2c7","#ff7c80","#f9d161","#feb46a","#00b0f0","#d9d9d9", "#4f81bd",    "#00b050", "#c00000"]);
		} else {
			data1 = $.extend(true, [], calendarModel.totalBusyHours);		
			var color1 = d3.scale.ordinal()
								.range(monthColors);
		}

		   
	data1.forEach(function(d) {
	    d.MAIN 			= d.hoursByColor[0];
	    d.Lightblue 	= d.hoursByColor[1];
	    d.Lightgreen 	= d.hoursByColor[2];
	    d.Violet 		= d.hoursByColor[3];
	    d.Lightred 		= d.hoursByColor[4];
	    d.Gold 			= d.hoursByColor[5];
	    d.Orange 		= d.hoursByColor[6];
	    d.Turquoise 	= d.hoursByColor[7];
	    d.Grey 			= d.hoursByColor[8];
	    d.Blue 			= d.hoursByColor[9];
	    d.Green 		= d.hoursByColor[10];
	    d.Red 			= d.hoursByColor[11];
	    });

	//Sets color domain names to names of properties from data[0]
	//"date", "hours", "hoursByColor" are omitted
	color1.domain( d3.keys(data1[0]).filter( function(key) {
		if(key !== "date" && key !== "hours" && key !== "hoursByColor"){return key;}
		}));
		  
	data1.forEach(function(d) {
		var x0 = 0;
		var x1 = 0;
		d.events = color1.domain().map(function(name) {
			return {name: name, x0: x0, x1: x0 += Math.ceil(+d[name]/d.hours*cellSize)}; 
			});
		});

	

	var x = d3.scale.linear().rangeRound([cellSize, 0]).domain([0, cellSize]);
	  
	for ( var int = 0; int < svg[0].length; int++) {
		var block =d3.select('#' + svg[0][int].id).selectAll(".block")
		.data(data1)
		.enter()
		.append("g")
		.filter( function(d) {
			return new Date(Date.parse(d.date)).getFullYear() == svg[0][int].id.substring(4);
		})
		.attr("date", function(d){return d.date;})
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
		.attr("style:opacity",function(d){return d.hours/appModel.strongestColorForHours;} );
		
		
		
		block.selectAll("g")
		.data(function(d) { return d.events; })
		.enter()
		.append("rect")
		.attr("height", cellSize)
		.attr("x", function(d) { return x(1-d.x0); })
		.attr("width", function(d) { return x(d.x0) - x(d.x1); })
		.style("fill", function(d) { return color1(d.name); });
	}
	
	
	
	
	
}
	
	
d3.select("#year2012").append("text")
.attr("class", "complexLabel")
.attr("x", 0)
.attr("y", -40)
.attr("height", 30)
.attr("width", 100)
.style("fill",(appModel.complexity == "simple")? "red" : "black" )
.text("simple");




d3.select("#year2012").append("text")
.attr("class", "complexLabel")
.attr("x", 40)
.attr("y", -40)
.attr("height", 30)
.attr("width", 100)
.style("fill",(appModel.complexity == "complex")? "red" : "black" )
.text("complex");

/*


svg.append("text")
.attr("class", "yrlabel")
.attr("x", 100)
.attr("y", -40)
.attr("height", 30)
.attr("width", 100)
.style("fill",(appModel.yearLast == "2012")? "red" : "black" )
.text("2012");


svg.append("text")
.attr("class", "yrlabel")
.attr("x", 130)
.attr("y", -40)
.attr("height", 30)
.attr("width", 100)
.style("fill",(appModel.yearLast == "2013")? "red" : "black" )
.text("2013");

*/

	
	d3.select(self.frameElement).style("height", "2910px");


	
	$(".monthLabel").bind('mouseenter mouseout click', function() {monthLabelController(this, event, k, selected, monthColors);});
	$(".day").bind('mouseenter mouseout', function() {dayController(this, event);});
	callback();

	
	
		

$(".yrlabel").bind('click', function() {switchYear(this, event);});
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


function switchYear(arg,event) {

	if (event.type == "click") {	

		if (arg.textContent=="2012"){ appModel.yearLast = "2012";}
		if (arg.textContent=="2013"){ appModel.yearLast = "2013";}
		
appView.update("complexity changed");
	}

}




function yearViewUpdate() {
	var see = 0;
	var k;
	for (var i in appModel.selectedCldrs) {	if (appModel.selectedCldrs[i]) {see++; k = i;}	}
	if(see>1)k=null;
	
	appModel.setWorkingStatus("updating year view...");
	yearView(k, appModel.selectedCldrs, calendarModel.colors, function(){appModel.setWorkingStatus("");});	

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
function monthLabelController(monthLabel, event, k, selected, monthColors) {
	if (event.type == "mouseover") {		
		$(monthLabel).css("cursor", "pointer");
		$(monthLabel).css("fill","#559393");
	} else if (event.type == "mouseout") {
		$(monthLabel).css("fill","");
	} else if (event.type == "click") {
		$(monthLabel).css("fill","#559393");
		appModel.selectedYear=+monthLabel.attributes.yearNumber.value;
		appModel.selectedMonth=+monthLabel.attributes.monthNumber.value;
		monthView = new MonthView(k, selected,
			+monthLabel.attributes.yearNumber.value,
			+monthLabel.attributes.monthNumber.value,
			monthColors,
		function(){});
	}
}

function dayController(day, event) {
	if (event.type == "mouseover") {		
		$(day).css('stroke','#444444');
	} else if (event.type == "mouseout") {
		$(day).css('stroke',"");
	}
}
