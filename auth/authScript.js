var access_code = null;
var spotifyClientID = "4e23da998a794a88bb254537f72d09f6";
var spotifyClientSecret = "8be49b8fdd454f50aeffba5126086fbf";

/*********
Code for QueryString from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
Used to extract the token information after a spotify user allows access to personal Spotify account. We need
this functionality to manipulate the Spotify playlist (for exporting)
*********/
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

//used to get the token to access a user's playlists
function sendToSpotifyUserAuthorizationPage(){
	searchUrl = "https://accounts.spotify.com/authorize?client_id="+spotifyClientID+"&response_type=code&redirect_uri=http://localhost:8000/auth/";
	window.location.replace(searchUrl);
}

function acquireTokenToAccessUserPlaylists(){
	var str = spotifyClientID + ':' + spotifyClientSecret;
	var loginBase64 = 'Basic ' + btoa(str);
	console.log(loginBase64);
	searchUrl = 'https://accounts.spotify.com/api/token?grant_type=authorization_code&code='+access_code+'&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2F';
	console.log(searchUrl);

	$.ajax({
			type: 'POST',
			// dataType: 'jsonp',
			url: searchUrl,
			crossDomain: true,
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Authorization' : loginBase64
			},
			// beforeSend: function (xhr) {
   //  		xhr.setRequestHeader ("Authorization", "Basic " + loginBase64);
			// 	},
			// beforeSend: function(xhr) { 
			// 	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); 
			// 	xhr.setRequestHeader('Authorization', loginBase64);
			// 	console.log(xhr); },
			
			success: function(response) {
				console.log(response);	
					
		    } 
	});

}

function acquireAccessToSpotifyUserPlaylists() {
	if(QueryString['code']==undefined){
		sendToSpotifyUserAuthorizationPage(); }
		access_code = QueryString['code'];
		console.log(access_code);
		if (QueryString['error'] != undefined) { 
			alert("Please allow access to your Spotify account in order to user MusicFlux.");
			window.location.replace("http://localhost:8000/auth/");
		}
	else {
		access_code = QueryString['code'];
		acquireTokenToAccessUserPlaylists();
	};
}

acquireAccessToSpotifyUserPlaylists();
