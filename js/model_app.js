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
	
	this.loginStatus = false;
	this.libraryStatus = false;
	this.calendarsLoaded = false;
	
	this.yearFirst = 2012; // hardcoded but prepared to become dynamic
	this.yearLast = 2013;

	this.selectedYear;
	this.selectedMonth;

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
	this.setCldrStatus = function(index, value) {
		if (this.cldrStatus[index] == null) {
			for (var i=0; i<index; i++)this.cldrStatus[i]=value;
		} else {
			this.cldrStatus[index] = value;
		}
		this.notifyObservers("cldrStatus");
		this.notifyObservers(value);
	}
	this.setSelectedCldrs = function(index, value) {
		if (this.selectedCldrs[index] == null) {
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
