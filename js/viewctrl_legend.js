function legendView(parent) {
	
	$(parent).empty();

	// Width and height
	var w = 180;
	var h = 30;
	var padding = 50;

	var dataset = [ 
        [ "q0-11" ], 
        [ "q1-11" ], 
        [ "q2-11" ], 
        [ "q3-11" ],
        [ "q4-11" ], 
        [ "q5-11" ], 
        [ "q6-11" ], 
        [ "q7-11" ], 
        [ "q8-11" ],
        [ "q9-11" ], 
        [ "q10-11" ],
	];

	var color_hash = {
		0 : [ "0 hours", "rgb(255,255,250)" ],
		1 : [ "", "rgb(255,255,204)" ],
		2 : [ "", "rgb(255,237,160)" ],
		3 : [ "", "rgb(254,217,118)" ],
		4 : [ "", "rgb(254,178,76)" ],
		5 : [ "", "rgb(253,141,60)" ],
		6 : [ "", "rgb(252,78,42)" ],
		7 : [ "", "rgb(227,26,28)" ],
		8 : [ "10+ hours", "rgb(177,0,38)" ],
		9 : [ "", "rgb(137,0,27)" ],
		10 : [ "", "rgb(73,0,12)" ],
	}

	// Create SVG element
	var svg = d3.select(parent)
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	// add legend
	var legend = svg.append("g")
				.attr("class", "legend")
				.attr("x", w - 180)
				.attr("y", 25)
				.attr("height", 100)
				.attr("width", 180);

		legend.selectAll('g')
				.data(dataset)
				.enter().append('g').each(function(d,i) {
				
				var g = d3.select(this);

				g.append("rect")
				.attr("y", w - 180)
				.attr("x", i * 16)
				.attr("width", 16)
				.attr("height", 16)
				.attr("style:opacity","0.8")
				.style("fill", color_hash[String(i)][1])
				.style("stroke", "#CCCCCC");

				g.append("text")
				.attr("y", w - 150)
				.attr("x", i * 16)
				.attr("height", 30)
				.attr("width", 100)
				.style("fill", "grey")
				.text(color_hash[String(i)][0]);

				});
}
