function yearView(k, selected,monthColors, callback) {
	
	$("#yearViewCanvas").empty();
	
	var width = 960, height = 186, cellSize = 17; 
	var day = d3.time.format("%w"), 
	week = d3.time.format("%U"), 
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
		.attr("transform" , "translate(-20," + cellSize * 3.5 + ")rotate(-90)")
		.style("text-anchor", "middle")
		.text(function(d) {return d;});

	var dateLabel = svg.selectAll(".label")
		.data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("text") 
		.attr("class", "label") 
		.attr("x", function(d) {
			if (day(d) == 0) {
				return (week(d) - 1) * cellSize;
			} else if (day(d) > 0) {
				return week(d) * cellSize;
			}
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

	var rect = svg.selectAll(".day")
		.data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
		.enter().append("rect") 
		.attr("class", "day")
		.attr("width", cellSize)
		.attr("height", cellSize)
		.attr("style:opacity","0.5")
		.attr("x", function(d) {
					if (day(d) == 0) {
						return (week(d) - 1) * cellSize;
					} else if (day(d) > 0) {
						return week(d) * cellSize;
					}
				}) 
		.attr("y", function(d) {
					if (day(d) == 0) {
						return 6 * cellSize;
					} else if (day(d) > 0) {
						return (day(d) - 1) * cellSize;
					}
				}) 
		.datum(format);
	

	
	$('.label').mouseover(function(){
		
	});
	
	$('.day').mouseover(function(){
		$(this).css('stroke','#111155');
		$(this).css('box-shadow','inset 0px -5px 10px 0px rgba(0, 0, 0, 0.5)')
	});
	
	$('.day').mouseleave(function(){
		$(this).css('stroke',"")
		$(this).css('box-shadow','');
	});
		
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
		.attr("y", -15)
		.attr("yearNumber", function(d) { return d3.time.format("%Y")(d);})
		.attr("monthNumber", function(d) { return d3.time.format("%m")(d); })
		.text(function(d) { return d3.time.format("%B")(d) });
		
		$(".monthLabel").mouseover(function() {
			$(this).css("cursor", "pointer");
			$(this).addClass("monthLabelMouse");
		});
		
		$(".monthLabel").mouseleave(function() {
			$(this).addClass("monthLabel");
		});
		
		$(".monthLabel").click(
				function() {
					$(".monthLabel").css("fill", "#000000");
					
					$("#settings").show();
					appModel.selectedYear=+this.attributes.yearNumber.value;
					appModel.selectedMonth=+this.attributes.monthNumber.value;
					
					monthView = new MonthView(k, selected,
							+this.attributes.yearNumber.value,
							+this.attributes.monthNumber.value,
							monthColors,
							function(){});
					$(this).css("fill", "#559393");
				});

		function monthLabelPositionX(t0) {
			var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), d0 = +day(t0), w0 = +week(t0), d1 = +day(t1), w1 = +week(t1);
			if (d0 == 0) {
				return (w0 + w1 + 1) / 2 * cellSize;
			} else if (d0 > 0) {
				return (w0 + 1 + w1 + 1) / 2 * cellSize;
			}
		}
	
	/*------------------------*/
	/* importing the data */
	/*----------------------*/

	var data = d3.nest() 
		.key(function(d) { return d.date; }) 
		.rollup(function(d) { return d[0].hours; }) 
		.map(calendarModel.totalBusyHours); 
		
		rect.filter(function(d) { return d in data;}) 
			.attr("class", function(d) { return "day " + color(data[d]);})
			.attr("busyHours",function(d){ return data[d]; })
			.attr("date",function(d){ return d; } )
			.append("svg:title")
			.text(function(d){ return "On " + d + " you have totally " + data[d] + " hours of events" });
			
		dateLabel.filter(function(d){ return d in data; })
			.append("svg:title")
			.text(function(d){ return "you are" + data[d] + "hours busy"; })
		

	function monthPath(t0) { 
		
		var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), 
		d0 = +day(t0), w0 = +week(t0), 
		d1 = +day(t1), w1 = +week(t1); 
		if (d0 == 0) {
			return "M" + w0 * cellSize + "," + 6 * cellSize + "H" + (w0 - 1)
					* cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize + "V"
					+ d1 * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0 + "H"
					+ w0 * cellSize + "Z";
		} else if (d0 > 0) {
			return "M" + (w0 + 1) * cellSize + "," + (d0 - 1) * cellSize + "H"
					+ w0 * cellSize + "V" + 7 * cellSize + "H" + w1 * cellSize
					+ "V" + d1 * cellSize + "H" + (w1 + 1) * cellSize + "V" + 0
					+ "H" + (w0 + 1) * cellSize + "Z";
		}
	}
	
	d3.select(self.frameElement).style("height", "2910px");
	
	
	callback();
}