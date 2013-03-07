function legendView(){
	$("#mylegend").empty();
    //Width and height
    var w = 100;
    var h = 290;
    var padding = 50;
 
    var dataset = [
        ["q0-11"],
        ["q1-11" ],
        ["q2-11"],
        ["q3-11"],
        ["q4-11"],
        ["q5-11"],
        ["q6-11"],
        ["q7-11"],
        ["q8-11"],
        ["q9-11"],
        ["q10-11"],
        /*["q11-11"],
        ["q12-11"],*/
    ];

    var color_hash = {  0 : ["0-1 hours busy", "rgb(255,255,220)"],
		    			1 : ["1-2", "rgb(255,255,204)"],
		    			2 : ["2-3", "rgb(255,237,160)"],
		    			3 : ["3-4", "rgb(254,217,118)"],
		    			4 : ["4-5", "rgb(254,178,76)"],
		    			5 : ["5-6", "rgb(253,141,60)"],
		    			6 : ["6-7", "rgb(252,78,42)"],
		    			7 : ["7-8", "rgb(227,26,28)"],
		    			8 : ["8-9", "rgb(177,0,38)"],
		    			9 : ["9-10", "rgb(137,0,27)"],
		    			10: ["10+",   "rgb(73,0,12)"],
		    			/*11: ["q11-11", "rgb(35,0,6)"],
		    			12: ["q12-11", "rgb(16,0,4)"]*/
		  }                     
    
	// Create SVG element
	var svg = d3.select("#mylegend") //body replaced by #mylegend 
	.append("svg")
	    .attr("width", w)
	    .attr("height", h);

	// Add title	  
/*	svg.append("svg:text")
	   //.attr("class", "title")
		.style("fill", "grey")
	   .attr("x", 0)
	   .attr("y", 15)
	   .text("Hours busy:");
*/

	// add legend   
	var legend = svg.append("g")
	  .attr("class", "legend")
	  .attr("x", w - 100)
	  .attr("y", 25)
	  .attr("height", 100)
	  .attr("width", 100);
	  
	legend.selectAll('g').data(dataset)
      .enter()
      .append('g')
      .each(function(d, i) {
        var g = d3.select(this);
        g.append("rect")
          .attr("x", w - 100)
          .attr("y", i*15 +20)
          .attr("width", 10)
          .attr("height", 10)
          .style("fill", color_hash[String(i)][1])
          .style("stroke", "#CCCCCC");
        
        g.append("text")
          .attr("x", w - 85)
          .attr("y", i * 15 + 29)
          .attr("height",30)
          .attr("width",100)
          .style("fill", "grey")
          .text(color_hash[String(i)][0]);


      });
}

