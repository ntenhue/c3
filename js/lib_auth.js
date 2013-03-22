/*
 * Authentification
 * custom library written on the basis of Google examples
 * https://code.google.com/p/google-api-javascript-client/wiki/Authentication
 * 
 */

function Authentification(appModel) {
	var clientId = '237411638986.apps.googleusercontent.com';
	var apiKey = 'AIzaSyCH9eEr4ijN_GsM0O-P6KIT9Y6n-VOTfOI';
	var scopes = 'https://www.googleapis.com/auth/calendar';

	
	

	//need to wait while gapi library loads
	setTimeout(function() {

		function handleClientLoad() {
			gapi.client.setApiKey(apiKey);
			
			console.log('checking if you are already signed in...');
			window.setTimeout(checkAuth, 1);
			
		}

		function checkAuth() {
			gapi.auth.authorize({
				client_id : clientId,
				scope : scopes,
				immediate : true
			}, handleAuthResult);
		}

		function handleAuthResult(authResult) {
			var authorizeButton = document.getElementById('authorize-button');
			if (authResult && !authResult.error) {
				authorizeButton.style.visibility = 'hidden';
				appModel.setLoginStatus(true);
				console.log('sign in OK, loading calendar API...');
				makeApiCall();
			} else {
				authorizeButton.style.visibility = '';
				console.log('sign in failed, waiting for button...');
				authorizeButton.onclick = handleAuthClick;
			}
		}

		function handleAuthClick(event) {
			console.log('attempt to sign in...');
			gapi.auth.authorize({
				client_id : clientId,
				scope : scopes,
				immediate : false
			}, handleAuthResult);
			
			return false;
		}
		
		function makeApiCall() {
			gapi.client.load('calendar', 'v3', function() {
				appModel.setLibraryStatus(true);
				console.log('calendar API loaded :)'); });	
		}	
			

		console.log('auth started...'); 
		// start automatic sign in
		this.handleClientLoad = new handleClientLoad();
		
		
		

	}, 1000);

}
