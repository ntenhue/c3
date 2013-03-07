/**
 * @author Angie Skazka
 */


	/*****************************************  
	    AppModel    
	*****************************************/

function AppModel(){
	this.loginStatus = false;
	this.libraryStatus = false;
	
	this.yearFirst = 2012;
	this.yearLast = 2013;
	
	this.selectedYear;
	this.selectedMonth;
	
	this.selectedCldrs;
	
	
	this.setLoginStatus = function (value) {	
		this.loginStatus=value;
		this.notifyObservers("loginStatus");	}	
	this.setLibraryStatus = function (value) {	
		this.libraryStatus=value;
		this.notifyObservers("libraryStatus");	}
	
	this.getLoginStatus = function () {	
		return this.loginStatus;}
	this.getLibraryStatus = function () {	
		return this.libraryStatus;}	
	
	this.colorMonth = "byCalendars";
	
	
	
	this.cldrStatus = [];
	this.setCldrStatus = function (index,value) {	
		this.cldrStatus[index]=value;
		this.notifyObservers("cldrStatus");
		}
	this.getCldrStatus = function (index) {	
		return this.cldrStatus[index];
		}	
	
	this.workingStatus;
	this.setWorkingStatus = function (value) {	
		this.workingStatus=value;
		this.notifyObservers("workingStatus");
		}
	this.getWorkingStatus = function () {	
		return this.workingStatus;
		}		
	
	
	/*****************************************  
	    Observable implementation    
	*****************************************/

	this._observers = [];

	this.addObserver = function(observer) 
	{
		this._observers.push(observer);
	}

	this.notifyObservers = function(arg) 
	{
		for(var i=0; i<this._observers.length; i++) 
		{
			this._observers[i].update(arg);
		}	
	}
		
}
