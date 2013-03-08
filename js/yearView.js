function yearView(k, selected,monthColors, callback) {
	$("#yearViewCanvas").empty();
	var width = 960, height = 186, cellSize = 17; // cell size
	var day = d3.time.format("%w"), // %w weekday as a decimal number
	// [0(Sunday),6].
	week = d3.time.format("%U"), // %U week number of the year (Sunday as the
	// first day of the week) as a decimal
	// number [00,53].
	percent = d3.format(".1%"), format = d3.time.format("%Y-%m-%d");
	// mapping the values to colors
	var color = d3.scale.quantize() // quantize() ,output discrete range, the
	// mapping is linear
	.domain([ 0.0, 12.0 ]) // input domain
	.range(d3.range(11).map(function(d) {
		return "q" + d + "-11";
	}));
	// output range, discrete
	// # d3.range([start, ]stop[, step]), here the output is 0,1,2...,11, being
	// mapped by the function to another array
	// .map - Create a new array with the result of a function of every element
	// in the array.
	var svg = d3.select("#yearViewCanvas").selectAll("svg")
			.data([ appModel.yearFirst, appModel.yearLast ]).enter().append("svg").attr("width", width)
			// each node is a svg with the preset width& height
			.attr("height", height).attr("class", "RdYlGn") // and class RdYlGn
			.append("g").attr(
					"transform",
					"translate(" + ((width - cellSize * 53) / 2) + ","
							+ (height - cellSize * 7 - 1) + ")").attr("id",
					function(d) {
						return "year" + d;
					});
	// (29.5,16)
	svg.append("text").attr("transform",
			"translate(-20," + cellSize * 3.5 + ")rotate(-90)").style(
			"text-anchor", "middle").text(function(d) {
		return d;
	}); // force the number to string, the d is every datum from the data
	/*
	 * var januaryButton = $("<button>");
	 * januaryButton.attr("class","monthLabel");
	 * januaryButton.attr("transform","translate(18,-5)");
	 * januaryButton.html("January"); januaryButton.onclick = monthView(2012,1);
	 * 
	 * //svg.append(januaryButton);
	 */

	var rect = svg.selectAll(".day").data(function(d) {
		return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
	})
	// d3.time.days(start, stop[, step]), the return here are two arrays of the
	// days from year 2012,to year 2013, and 2013-2014
	// Date(year, month, day)
	// it gets every day from the year d to year d+1
	.enter().append("rect") // currently, the class .day is empty, here they
	// create nodes from every datum in the data
	.attr("class", "day").attr("width", cellSize).attr("height", cellSize)
			.attr("x", function(d) {
				if (day(d) == 0) {
					return (week(d) - 1) * cellSize;
				} else if (day(d) > 0) {
					return week(d) * cellSize;
				}
			}) // position of each grid, week = d3.time.format("%U")
			.attr("y", function(d) {
				if (day(d) == 0) {
					return 6 * cellSize;
				} else if (day(d) > 0) {
					return (day(d) - 1) * cellSize;
				}
			}) // day = d3.time.format("%w"), get the weekday number from the
			.datum(format);
	var dateLabel = svg.selectAll(".label").data(function(d) {
		return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
	})
	// d3.time.days(start, stop[, step]), the return here are two arrays of the
	// days from year 2012,to year 2013, and 2013-2014
	// Date(year, month, day)
	// it gets every day from the year d to year d+1
	.enter().append("text") // currently, the class .day is empty, here they
	// create nodes from every datum in the data
	.attr("class", "label") // .style("fill", "#888888")
	// .attr("width", cellSize)
	// .attr("height", cellSize)
	.attr("x", function(d) {
		if (day(d) == 0) {
			return (week(d) - 1) * cellSize;
		} else if (day(d) > 0) {
			return week(d) * cellSize;
		}
	}) // position of each grid, week = d3.time.format("%U")
	.attr("y", function(d) {
		if (day(d) == 0) {
			return 6 * cellSize;
		} else if (day(d) > 0) {
			return (day(d) - 1) * cellSize;
		}
	}) // day = d3.time.format("%w"), get the weekday number from the
	.attr("transform", "translate(9,12)").style("text-anchor", "middle").text(
			function(d) {
				return d3.time.format("%d")(d);
			}); // get the value from format, format =
	// d3.time.format("%Y-%m-%d")
	var monthPath = svg.selectAll(".month").data(function(d) {
		return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
	})
	// every first day of each month from year d to year d+1
	.enter().append("path").attr("class", "month").attr("d", monthPath);
	var monthLabel = svg.selectAll(".monthLabel").data(function(d) {
		return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
	}).enter().append("text").attr("class", "monthLabel").style("text-anchor",
			"middle").attr("x", monthLabelPositionX).attr("y", -15).attr(
			"yearNumber", function(d) {
				return d3.time.format("%Y")(d);
			}).attr("monthNumber", function(d) {
		return d3.time.format("%m")(d);
	}).text(function(d) {
		return d3.time.format("%B")(d)
	});
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
	// d3-array:https://github.com/mbostock/d3/wiki/Arrays
	// d3.csv("", function(csv) {
	// console.log(csv);
	// csv = calendarModel.occupancy;
	// console.log(csv);
	var data = d3.nest() // Nesting reform the input array into an
	// hierarchical structure
	.key(function(d) {
		return d.date;
	}) // the key(function) controls the level rule in the tree
	.rollup(function(d) {
		return d[0].hours;
	}) // The leaf level is replaced by a value at the parent level
	// formerly, the value of each key is an array of an object
	.map(calendarModel.totalBusyHours); // The return value of the rollup
	// function will replace the
	// array of leaf values in either the associative array
	// returned by the map operator, or
	// Applies the nest operator to the specified array, returning an
	// associative array.
	// selector,filter:https://github.com/mbostock/d3/wiki/Selections#wiki-filter
	rect.filter(function(d) {
		return d in data;
	}) // Filters the selection, returning a new selection that contains
	// only the elements for which the specified selector is true.
	// rect - svg('.day')
	.attr("class", function(d) {
		return "day " + color(data[d]);
	}) // set the class of the grid to a particular color class according
	// to the value
	.select("title").text(function(d) {
		return d + " you are busy: " + data[d] + " hours";
	}); // set the busy hours to title
	// });//csv
	function monthPath(t0) { // t0 is the first day of a month, t1 is the
		// last day of the month
		var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0), // new
		// Date(1990,0,0)
		// = the
		// previous
		// day of
		// 1990-1-1
		d0 = +day(t0), w0 = +week(t0), // the result of day(t0) is type of
		// string, = + make it into a number
		d1 = +day(t1), w1 = +week(t1); // week number also start with 0;
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