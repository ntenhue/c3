/**
 * @author Angie Skazka
 */


function AppGeneralController(appModel) {
    
    authentification = new Authentification(appModel);
    
    //Register an observer to the model
    appModel.addObserver(this);

    
    
    
    //This function gets called when there is a change at the model
    this.update = function(arg) {
    //setTimeout(function() {}, 2000);
        if (arg == 'libraryStatus' && appModel.getLibraryStatus()) {
            calendarModel = new CalendarModel();
            askGoogle = new AskGoogle(calendarModel);
            askGoogle.loadCalendars();            
            
            appModel.selectedCldrs=[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];
            
            view = new View($("#workspace"), calendarModel);

            
            setTimeout(function() {
            	viewController = new ViewController(view, calendarModel);
            }, 2000);
            
            yearView(null, appModel.selectedCldrs, function(){}); 
            legendView();

            }
        }
    
    
    	this.about = function(){
    		
    	}
    }

