/*
 * AppModel
 * contains attributes and methods that affect representation but do not change the data
 * 
 * Messages on status updates are posted to globally visible app model 
 * (since they do not affect the actual data, I avoid having them in calendar model). 
 * Then app observers parse messages and perform actions. 
 * Maybe it is not the best way to make architecture, 
 * but it nicely keeps the stuff separate and allows 
 * asynchronous calls to API without of having timers 
 * or while loops to wait for response.
 */

function AppModel() {
	/***************************************************************************
	 * APP PROPERTIES
	 **************************************************************************/
	this.now = new Date();

	this.loginStatus = false;
	this.libraryStatus = false;
	this.calendarsLoaded = false;
	
//	this.searchGoing = false;

	this.yearFirst = this.now.getFullYear() - 1;
	this.yearLast = this.now.getFullYear();

	this.complexity = "simple";
	this.lightestColorForHours = 0.0;
	this.strongestColorForHours = 12.0;
	
	this.selectedYear = this.now.getFullYear();
	this.selectedMonth;
	
	this.searchString="";
	this.searchCaseSensitive=false;
	this.searchDurationMin=0;
	this.searchDurationMax=24;
	this.searchHideFiltered=false;
	this.searchColors=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
	
	
	this.selectedCldrs=[];
	this.cldrStatus = [];
	this.workingStatus;
	
	this.colorMonth="byCalendars";

	/***************************************************************************
	 * SETTERS
	 **************************************************************************/
	this.setLoginStatus = function(value) {
		this.loginStatus = value;
		this.notifyObservers("loginStatus");
	}
	this.setCalendarsLoaded = function(value) {
		this.calendarsLoaded = value;
		this.notifyObservers("calendars loaded");
	}
	this.setLibraryStatus = function(value) {
		this.libraryStatus = value;
		this.notifyObservers("library loaded");
	}
	this.setCldrStatus = function(index, value, length) {
		if (length!=null) {
			for (var i=0; i<length; i++)this.cldrStatus[i]=value;
		} else {
			this.cldrStatus[index] = value;
		}
		this.notifyObservers("cldrStatus");
		this.notifyObservers(value);
	}
	this.setSelectedCldrs = function(index, value, length) {
		if (length!=null) {
			for (var i=0; i<index; i++)this.selectedCldrs[i]=value;
		} else {
			this.selectedCldrs[index] = value;
		}
		this.notifyObservers("selectedCldrs");
	}
	this.setWorkingStatus = function(value) {
		this.workingStatus = value;
		this.notifyObservers("workingStatus");
	}
    this.setYearFrame = function(yearFirst, yearLast){
        if (yearFirst!=null) this.yearFirst = yearFirst;
        if (yearLast!=null)  this.yearLast = yearLast;
        this.notifyObservers("updated yearframe");
    }

	/***************************************************************************
	 * GETTERS
	 **************************************************************************/
	this.getLoginStatus = function() {
		return this.loginStatus;
	}
	this.getLibraryStatus = function() {
		return this.libraryStatus;
	}
	this.getCldrStatus = function(index) {
		if (index == null) {
			return this.cldrStatus
		} else {
			return this.cldrStatus[index];
		}
	}
	this.getSelectedCldrs = function(index) {
		if (index == null) {
			return this.selectedCldrs
		} else {
			return this.selectedCldrs[index];
		}
	}
	this.getWorkingStatus = function() {
		return this.workingStatus;
	}

	/***************************************************************************
	 * Observable implementation
	 **************************************************************************/

	this._observers = [];

	this.addObserver = function(observer) {
		this._observers.push(observer);
	}

	this.notifyObservers = function(what) {
		for ( var i in this._observers) {
			this._observers[i].update(what);
		}
	}

}
