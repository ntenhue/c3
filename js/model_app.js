function AppModel() {
	this.loginStatus = false;
	this.libraryStatus = false;
	this.calendarsLoaded = false;
	
	this.yearFirst = 2012;
	this.yearLast = 2013;

	this.selectedYear;
	this.selectedMonth;

	this.selectedCldrs=[];

	this.cldrStatus = [];
	this.workingStatus;

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
		if (index == null) {
			for ( var i in this.cldrStatus)this.cldrStatus[i] = value;
		} else {
			this.cldrStatus[index] = value;
		}
		this.notifyObservers("cldrStatus");
	}
	this.SetSelectedCldrs = function(index, value) {
		if (index == null) {
			for ( var i in this.selectedCldrs)this.selectedCldrs[i] = value;
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

	this.notifyObservers = function(arg) {
		for ( var i = 0; i < this._observers.length; i++) {
			this._observers[i].update(arg);
		}
	}

}
