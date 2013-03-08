function View(parent, calendarModel) {

	this.listCalendarsButton = $("<button>");
	this.listCalendarsButton.html("Update calendars");
	
	this.listCalendarsDiv = $("<div>");	 this.cldrList = [];

	this.updateViewButton = $("<button>");
	this.updateViewButton.html("Show");

	this.workingSpan = $('<span style="color:#CCCCCC">');
	
	parent.append(this.listCalendarsDiv, /*this.updateViewButton,*/ " ", this.workingSpan);
	
	this.colorEventsButton = $("<button>");
	this.colorEventsButton.html("E");
	
	this.colorCalsButton = $("<button>");
	this.colorCalsButton.html("C");
	
	this.colorMonthSpan = $("<span>");
	this.colorMonthSpan.html(appModel.colorMonth);

	
	//$("#settings").append( this.colorCalsButton, this.colorEventsButton, "Color bars: ", this.colorMonthSpan);
	$("#settings").hide();
	
	/***************************************************************************
	 * Observer implementation
	 **************************************************************************/

	// Register an observer to the model
	calendarModel.addObserver(this);
	appModel.addObserver(this);

	// This function gets called when there is a change in the model
	this.update = function(what, k) {

		if (what == "calendars") {
			this.listCalendarsDiv.empty();


			var calendars = calendarModel.getCalendars();
	
		
			
			function Item (){
				this.checked = true;
				this.div = $('<div>');
				this.square = $('<div class="cldrListSquare">');
				this.label = $('<span>');
				this.status = $('<span style="color:#CCCCCC">');
			}
			
			for ( var i in calendars) {

				var item = new Item();

				item.div = $('<div>');
				
				item.square=$('<div class="cldrListSquare">')
							.attr("id",i)
							.appendTo(item.div);
				
				item.div.append(" ");
				
				item.label = $('<span>')
							.html(calendars[i].summary)
							.appendTo(item.div);
				
				item.div.append(" ");
				
				item.status = $('<span style="color:#CCCCCC">')
							.html(appModel.getCldrStatus(i))
							.appendTo(item.div);
				
				item.div.append("<br>");
				
				this.cldrList[i]=item;
				this.listCalendarsDiv.append(this.cldrList[i].div);
				
				this.cldrList[i].square.click(function() {	
				appModel.selectedCldrs[$(this).attr('id')]=!appModel.selectedCldrs[$(this).attr('id')];
				view.update("calendarsOnOff",null);	
				view.updateViewButton.click()
				});
				
				

			}
			this.update("calendarsOnOff",null);	

		}
		
		

		if (what == "calendarsOnOff") {
			
			var calendars = calendarModel.getCalendars();
			for ( var i in calendars) {
				if (appModel.selectedCldrs[i]){
				//	this.cldrList[i].square.addClass('cldrListSquareColorId' + calendars[i].colorId);				
					this.cldrList[i].square.css("background-color", calendars[i].backgroundColor);
					this.cldrList[i].square.css("border-color", calendars[i].backgroundColor);
				}else{
				//	this.cldrList[i].square.removeClass('cldrListSquareColorId' + calendars[i].colorId);
					this.cldrList[i].square.css("background-color", "#FFFFFF");
					this.cldrList[i].square.css("border-color", "#CCCCCC");
				}
			}
		}
			
		
		if (what == "yearview") {
			var see = 0;
			var k;
			for ( var i in this.cldrList) {	if (appModel.selectedCldrs[i]) {	see++; k = i;	}	}

			if (see != 0) {	
				if (see > 1) k=null;
				
			appModel.setWorkingStatus("updating year view...");
			yearView(k, appModel.selectedCldrs, calendarModel.colors, function(){appModel.setWorkingStatus("");});	
			}
		}
		
		
		if (what == "cldrStatus") {
			for (var i in this.cldrList)this.cldrList[i].status.html(appModel.getCldrStatus(i));
		}
		
		
		if (what == "workingStatus") {
			this.workingSpan.html(appModel.getWorkingStatus());
		}
		
		
		if (what == "monthview") {
			var see = 0;
			var k;
			for ( var i in this.cldrList) {	if (appModel.selectedCldrs[i]) {	see++; k = i;	}	}

			if (see != 0 && appModel.selectedMonth!=null) {	
				if (see > 1) k=null;
				appModel.setWorkingStatus("updating month view...");
				monthView = new MonthView (k, appModel.selectedCldrs,appModel.selectedYear,
											  appModel.selectedMonth, 
											  calendarModel.colors,
											  function(){appModel.setWorkingStatus("");	});
				}else{ 
				$("#monthViewCanvas").empty();
				}
			
			this.colorMonthSpan.html(appModel.colorMonth);
		}
		
		
		if (what == "events loaded") {
			
			appModel.setWorkingStatus("calculating occupancy...");
			calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
			
			
			view.update("yearview");
			view.update("monthview");
		

		}
}
}















function ViewController(view, calendarModel) {

	view.colorCalsButton.click(function() {	appModel.colorMonth="byCalendars";	view.update("monthview"); });
	view.colorEventsButton.click(function() { appModel.colorMonth="byEvents"; 	view.update("monthview"); });
	

	view.updateViewButton.click(function() {
		var see = 0;
		var k;

		for ( var i in view.cldrList) {if (appModel.selectedCldrs[i] && appModel.cldrStatus[i]=='') {	
			
			
			askGoogle.checkUpdatesAndLoad(i);
			see++;
			}}
		
		setTimeout(function() {
		for ( var i in view.cldrList) {
			if (view.cldrList[i].checked
			&&!(appModel.getCldrStatus() == "updated" 
			  ||appModel.getCldrStatus() == "loaded")) {	see=0;
			}}	
		}, 500);

		
		if (see != 0) {	
			appModel.setWorkingStatus("calculating occupancy...");
			calendarModel.totalBusyHours = calendarModel.updateTotalBusyHours(calendarModel.calendars,	appModel.selectedCldrs);
			
			view.update("yearview");
			view.update("monthview");
			}

		});
	
	}
	