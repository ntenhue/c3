function MonthView(k, selected, yearNumber, monthNumber, monthColors, callback){
	
	$("#monthViewCanvas").empty();
	
	var margin = {top: 20, right: 100, bottom: 30, left: 40},
	    width = 600 - margin.left - margin.right,
	    height = 300 - margin.top - margin.bottom;
	
	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);
	
	var y = d3.scale.linear()
	    .rangeRound([height, 0]);
	
	//var color = d3.scale.ordinal()
	//	.range(monthColors);
	// .range(["#8064a2","#b9cde5","#99ffcc","#b3a2c7","#ff7c80","#f9d161","#feb46a","#00b0f0","#d9d9d9", "#4f81bd",    "#00b050", "#c00000"]);
	
	
	
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".2s"));
	
	var svg = d3.select("#monthViewCanvas").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		

	//var data = busyHours; //FFFFFFFFFFFFUUUUUUUUUUUUUUUUUUUUUUU!!!
	

		if (k!=null) {	
			var data = calendarModel.updateBusyHours(calendarModel.calendars[k].events);	
			//var data = [].concat(calendarModel.calendars[k].busyHours);
			var color = d3.scale.ordinal()
		   .range([monthColors[k],"#b9cde5","#99ffcc","#b3a2c7","#ff7c80","#f9d161","#feb46a","#00b0f0","#d9d9d9", "#4f81bd",    "#00b050", "#c00000"]);
		
		} else {
			var data = calendarModel.updateTotalBusyHours(calendarModel.calendars,selected);
			var color = d3.scale.ordinal()
			.range(monthColors);

		}

		   
		  data.forEach(function(d) {
		    
		    d.MAIN 		= d.hoursByColor[0];
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
		
		  color.domain( d3.keys(data[0]).filter( function(key) { 
									  					if(key !== "date" && key !== "hours" && key !== "hoursByColor"){
									  						return key;
									  					} 
		  										}));
		  
		  data.forEach(function(d) {
		  	
		  	var y0 = 0;
		    d.events = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
		    d.total = d.events[d.events.length - 1].y1;

		  });
		
		  //data.sort(function(a, b) { return b.total - a.total; });
			
			//var yearNumber = 2013;
			//var monthNumber = 3;
			var dateFormat = d3.time.format("%Y-%m-%d");
			var months = d3.time.format("%m");
			var dateNumber = d3.time.format("%d");
			/*
		  x.domain(data.map(function(d) { if( months(dateFormat.parse(d.date)) == monthNumber )
		  									{
		  										return dateNumber(dateFormat.parse(d.date)); 
		  									}
		  	 }).filter(function(d){ if (typeof(d) == "string") { return d; }}));
		  	 */
		  	var amonth = [];
		  	for(i=1;i<32;i++){
		  		amonth.push(i);
		  	}
		  	
		  x.domain(amonth);
		  
		  y.domain([0, d3.max(data, function(d) { return d.total; })]);
		  
		  var eventfulDays = data.map(function(d) { if( months(dateFormat.parse(d.date)) == monthNumber 
                  									&& d3.time.format("%Y")(dateFormat.parse(d.date)) == yearNumber)
		  									{
		  										return d; 
		  									}
		  	 }).filter(function(d){ if (typeof(d) == "object") { return d; }});
		  
		  
		
		  svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis);
		
		  svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text("Hours");
		
		  
		
		  var state = svg.selectAll(".state")
		      .data(eventfulDays)
		    .enter().append("g")
		      .attr("class", "g")
		      //.attr("x",function(d){ return dateNumber(dateFormat.parse(d.date))*14; })
		      .attr("transform", function(d) { return "translate(" + dateNumber(dateFormat.parse(d.date))*14 + ",0)"; });
		
		  state.selectAll("rect")
		      .data(function(d) { return d.events; })
		    .enter().append("rect")
		      .attr("width", 13)
		      .attr("y", function(d) { return y(d.y1); })
		      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
		      .style("fill", function(d) { return color(d.name); });
		
		  
		  if (k!=null){
		  
		  // set the Legend
		  var legend = svg.selectAll(".legend")
		      .data(color.domain().slice().reverse())
		    .enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
		      
		      
		
		  legend.append("rect")
		      .attr("x", width)
		      .attr("y", 10)
		      .attr("width", 13)
		      .attr("height", 13)
		      .style("fill", color);
		
		  legend.append("text")
		      .attr("x", width + 20)
		      .attr("y", 19)
		      .attr("dy", ".35em")
		      .style("text-anchor", "start")
		      .text(function(d) { return d; });
		  
		  
		  var legendComment = svg.append("g")
		  .append("text")
	      .attr("x", width)
	      .attr("y", 0)
	      .style("text-anchor", "start")
	      .text("Colored by events");
	       
		  }

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
		monthView = new MonthView (k, appModel.selectedCldrs,appModel.selectedYear,
									  appModel.selectedMonth, 
									  calendarModel.colors,
									  function(){appModel.setWorkingStatus("");	});
		}else{ 
		// slow call, not necessary
		//$("#monthViewCanvas").empty();
		}
	
}