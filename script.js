/* schedules.js is loaded from index.html.
   contains: energySched & tempoSched based on excel data 
   access format: energySched['weekday']['3']['happy']
			or 	  tempoSched['weekend']['22']['danceability']
	Note: danceability access is only for weekends.
 */

//Control Variables:
var maxSearchResults = 15; //Max is 100, controls Echo Nest results
var danceabilityRangeVari = 0.05; //controls Danceability range used
var energyRangeVari = 0.05; //controls energy range used


//Keys/Codes/Tokens
var key = "I8VH1VRNONS3DZD9F"; //Phil's Echo Nest key
// var key = "ENVDIG8W2BZ1H4OB0"; //Khal's Echo Nest key
var access_code = null;
var spotifyClientID = "4e23da998a794a88bb254537f72d09f6";
var spotifyClientSecret = "8be49b8fdd454f50aeffba5126086fbf";


var currentSongEnergy = null; // Ensure that current song playing always updates this value
var userControls = false; // Set if user "takes control" of energy switch 
var direction = null; // "asc" or "desc" , set if userControls == true
var currentMode = null; // "mood" or "seed_song"
var seed_song_id = null; // 

var mood_cache = {};
var currMood = "";

var songsInCurrentPlaylist = [];

/** 
All available moods: 
"terms": [{"name": "aggressive"}, {"name": "ambient"}, {"name": "angry"}, {"name": "angst-ridden"}, {"name": "bouncy"}, 
{"name": "calming"}, {"name": "carefree"}, {"name": "cheerful"}, {"name": "cold"}, {"name": "complex"}, {"name": "cool"}, 
{"name": "dark"}, {"name": "disturbing"}, {"name": "dramatic"}, {"name": "dreamy"}, {"name": "eerie"}, {"name": "elegant"},
{"name": "energetic"}, {"name": "enthusiastic"}, {"name": "epic"}, {"name": "fun"}, {"name": "funky"}, {"name": "futuristic"},
{"name": "gentle"}, {"name": "gleeful"}, {"name": "gloomy"}, {"name": "groovy"}, {"name": "happy"}, {"name": "harsh"},
{"name": "haunting"}, {"name": "humorous"}, {"name": "hypnotic"}, {"name": "industrial"}, {"name": "intense"},
{"name": "intimate"}, {"name": "joyous"}, {"name": "laid-back"}, {"name": "light"}, {"name": "lively"},
{"name": "manic"}, {"name": "meditation"}, {"name": "melancholia"}, {"name": "mellow"}, {"name": "mystical"},
{"name": "ominous"}, {"name": "party music"}, {"name": "passionate"}, {"name": "pastoral"}, {"name": "peaceful"},
{"name": "playful"}, {"name": "poignant"}, {"name": "quiet"}, {"name": "rebellious"}, {"name": "reflective"},
{"name": "relax"}, {"name": "romantic"}, {"name": "rowdy"}, {"name": "sad"}, {"name": "sentimental"}, {"name": "sexy"},
{"name": "smooth"}, {"name": "soothing"}, {"name": "sophisticated"}, {"name": "spacey"}, {"name": "spiritual"},
{"name": "strange"}, {"name": "sweet"}, {"name": "theater"}, {"name": "trippy"}, {"name": "warm"},
{"name": "whimsical"}], "type": "mood"}}
*/

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

$(".emoji").click(function(e){

	mood = $(this).attr("mood");
	$(".track").remove();
	//searchByTitle("scar tissue");

	createPlaylistFromMood(mood);
	//createPlaylistFromSeedSong("SOUKOUX12B0B80B0BA", true);

}); 

//Element doesn't currently exist
$("#switch").click(function (e){
	userControls = true;
	// userEnergyDirection = state of switch
	if(currentMode == "mood"){

	} else if (currentMode == "seed_song"){
		createPlaylistFromSeedSong(seed_song_id, false);
	}

});

function createPlayWidget(playlist_name){
	$("iframe").remove();
	trackIds = "";
	for (var i = 0; i < songsInCurrentPlaylist.length; i++){
		trackIds += songsInCurrentPlaylist[i] + ","
	}
	trackIds = trackIds.substring(0, trackIds.length - 1);
	iframe = "<iframe src=\"https://embed.spotify.com/?uri=spotify:trackset:"+playlist_name+":" + trackIds +"\" width=\"300\" height=\"380\" frameborder=\"0\" allowtransparency=\"true\"></iframe>";
	$("body").append(iframe);
}

function searchByTitle(title){
	searchUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&title="+title+"&bucket=tracks&sort=artist_familiarity-desc&bucket=id:spotify&limit=true"
	results = [];
	$.ajax({
			type: "GET",
			url: searchUrl,
			success: function(data) {
				$.each(data['response']['songs'], function(i, l){
					song = {};
					song['name'] = l['title'];
					song['artist'] = l['artist_name'];
					song['id'] = l['id'];
					song['album'] = l['tracks'][0]['album_name'];
					results.push(song);
					
				});
				//console.log(results);
				display_search_results(results);
			}
	});
}

// results is a list of song infos, structure specified in searchByTitle
function display_search_results(results){

}

function createPlaylistFromSeedSong(seedId, isInitialPlaylist){
	songsInCurrentPlaylist = [];
	currMood = "none";
	mood_cache[currMood] = [];
	currentSongEnergy = .5; // TODO: don't set here
	incrementEnergyBy = 0.04; //temp control for tesing
	seedValue = getAttributeFromCurrentDateTime(mood,energySched);
	direction = "desc"; // TODO: get actual direction
	song_type_url = "http://developer.echonest.com/api/v4/song/profile?api_key="+key+"&format=json&id="+seedId+"&bucket=song_type&bucket=audio_summary&bucket=id:spotify&bucket=tracks";
	$.ajax({
			type: "GET",
			url: song_type_url,
			success: function(data) {
				//console.log(data);
				artistId = data['response']['songs'][0]['artist_id'];
				genreSearchUrl = "http://developer.echonest.com/api/v4/artist/terms?api_key="+key+"&id="+artistId+"&format=json";
				$.ajax({
					type: "GET",
					url: genreSearchUrl,
					success: function(artistData) {
						genre = artistData['response']['terms'][0]['name'];
						//console.log(genre);
						song_type = data['response']['songs'][0]['song_type'];
						
						if (isInitialPlaylist) seed_energy = currentSongEnergy;
						else  seed_energy = data['response']['songs'][0]['audio_summary']['energy'];
					
						types = "";
						for (var i = 0; i < song_type.length; i++){
							types += "&song_type=" + song_type[i];
						}
						for(var i = 0; i < maxSearchResults; i++) {
							if(direction == "desc") incrementEnergyBy = -.04;
							energy = seed_energy + (i * incrementEnergyBy);
							danceability = seedValue[1];
							//console.log(energy)

							// Set the proper min and max for danceability
							if(danceability==null){ //no danceability requirement set
								min_danceability = 0.0;
								max_danceability = 1.0;
							}
							else{
								min_danceability = Math.max( (danceability - danceabilityRangeVari), 0.0);
								max_danceability = Math.min( (danceability + danceabilityRangeVari), 1.0)
							}
							
							// Set the proper min and max for energy
							if(energy==null){ //no energy requirement set
								min_energy = 0.0;
								max_energy = 1.0;
							}
							else{
								min_energy = Math.max( energy - energyRangeVari, 0.0);
								max_energy = Math.min( energy + energyRangeVari, 1.0);
								if(min_energy > 0) min_energy = max_energy - energyRangeVari;
								if(max_energy < 0) max_energy = min_energy + energyRangeVari;
							}

							similarSongUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+""+types+"&bucket=id:spotify&limit=true&bucket=tracks&bucket=audio_summary&style="+genre+
							"&min_energy="+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&sort=energy-"+direction+"&results=" + maxSearchResults;
							$.ajax({
								type: "GET",
								url: similarSongUrl,
								success: function(data) {
									//console.log(data);
									var n = Math.min(maxSearchResults, data['response']['songs'].length);
									var random = Math.floor((Math.random() * n));
									id = data['response']['songs'][random]['tracks'][0]['foreign_id']
									song_id = id.split(":")[2];
									searchByTrackId(song_id); 
									songsInCurrentPlaylist.push(song_id);	
								}, 
								complete: function(){
									createPlayWidget("Playlist");
								}
							});
						}
					}
				});
			}
	});

}

function createPlaylistFromMood(mood){
	songsInCurrentPlaylist = [];
	currMood = mood;
	var seedValue = getAttributeFromCurrentDateTime(mood,energySched);
	var incrementEnergyBy = 0.05; //temp control for tesing
	if (mood in mood_cache) {

		console.log('cached')
		console.log(mood_cache[mood])
		for(var i = 0; i < mood_cache[mood].length; i++){
			display_search_song(mood_cache[mood][i]['name'],  mood_cache[mood][i]['artists'][0]['name'], mood_cache[mood][i]['album']['name'], 
						mood_cache[mood][i]['album']['images'][1]['url'], mood_cache[mood][i]['preview_url'] );
		}
	} else {
		mood_cache[mood] = [];
		//console.log(seedValue);
		for(var i = 0; i < maxSearchResults; i++) {
			direction = "desc";
			if(direction == "desc") incrementEnergyBy = -0.05;
			var energy = seedValue[0] + (i * incrementEnergyBy);
			danceability = seedValue[1];

			// Set the proper min and max for danceability
			if(danceability==null){ //no danceability requirement set
				min_danceability = 0.0;
				max_danceability = 1.0;
			}
			else{
				min_danceability = Math.max( (danceability - danceabilityRangeVari), 0.0);
				max_danceability = Math.min( (danceability + danceabilityRangeVari), 1.0)
			}
			
			// Set the proper min and max for energy
			if(energy==null){ //no energy requirement set
				min_energy = 0.0;
				max_energy = 1.0;
			}
			else{
				min_energy = Math.max(energy - energyRangeVari, 0.0);
				max_energy = Math.min(energy + energyRangeVari, 1.0);
				if(min_energy > 0) min_energy = max_energy - energyRangeVari;
				if(max_energy < 0) max_energy = min_energy + energyRangeVari;
				//console.log(min_energy);
				//console.log(max_energy);
			}

			//console.log("Min Energy: "+min_energy+" / Max Energy: "+max_energy+" / Min Danceability:  "+min_danceability+" / Max Danceability: "+max_danceability); 

			if (mood == "christmas") {
 			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&song_type=christmas&bucket=id:spotify&limit=true&bucket=tracks&min_energy="
 				+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults; 
 			} else {
 			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&bucket=id:spotify&limit=true&bucket=tracks&mood="+mood+"&min_energy="+min_energy+"&max_energy="
 				+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults; 			
 			}
			$.ajax({
				type: "GET",
				url: apiUrl,
				success: function(data) {
					//console.log(data);
					var n = Math.min(maxSearchResults, data['response']['songs'].length);
					var random = Math.floor((Math.random() * n));
					id = data['response']['songs'][random]['tracks'][0]['foreign_id']
					
					song_id = id.split(":")[2];
					searchByTrackId(song_id); 
					songsInCurrentPlaylist.push(song_id);	
					}, 
					complete: function(){
						createPlayWidget("Playlist");
					}
			});
		}
	}
};

/*
A record is created using an array with the following tuple: [spotifyTrackid, dataJsonObject, songAlreadyPlayedBoolean]
*/
function addTrackToLocalStorage(id, data){
	var record = [];
	record.push(id);
	record.push(data);
	record.push(false);

	console.log(record);
	

}

function searchByTrackId(id){
	searchUrl = "https://api.spotify.com/v1/tracks/" + id
	$.ajax({
			type: "GET",
			url: searchUrl,
			success: function(data) {
				console.log(data);	
					display_search_song(data['name'],  data['artists'][0]['name'], data['album']['name'], 
						data['album']['images'][1]['url'], data['preview_url'] );

					mood_cache[currMood].push(data);
		    } 
	});
}

function display_search_song(song_name, artist, album, album_cover, preview_url){
$("body").append(
	'<div class="track"> ' +
		'<p>' + song_name + '</p>' +
		'<p>' + artist + '</p>' +
		'<p>' + album + '</p>' +
		'<img class = "album-img" data-preview-url="' + preview_url + 
			'" src="' + album_cover + '"/>' +
	'</div>');	
}

/*********************
Given a mood and a json object containing the schedule, this function will return the seed attribute value
Usage: getAttributeFromCurrentDateTime("happy",energySched);
Returns: array with two elements [energyValue, danceabilityValue]
NOTE: if it's a weekday, danceability element will be null
***********************/
function getAttributeFromCurrentDateTime(mood, attrSched ){
	var date = new Date();
	var day = date.getDay(); //returns day of the week (from 0-6, Sun-Sat)
	var hour = date.getHours(); // returns the hour (from 0-23, 12am-11pm)
	var weekend = false;
	var queryResult = [];

	if(day == "5" || day == "6"){ //If friday or saturday
		weekend = true;
	}

	if(weekend){
		queryResult.push(attrSched['weekend'][hour][mood]);
		queryResult.push(attrSched['weekend'][hour]['danceability']);
		return queryResult;
	}
	else{ //Weekday
		queryResult.push(attrSched['weekend'][hour][mood]);
		queryResult.push(null);
		return queryResult;
	}
}

/*********************
Similar to  getAttributeFromCurrentDateTime except this func will search with a 
given day (from 0-6, Sun-Sat) and hour (from 0-23, 12am-11pm), both strings.
Usage: getAttributeWithGivenDayTime("happy", energySched, "0", "23")
Returns: array with two elements [energyValue, danceabilityValue]
**********************/
function getAttributeWithGivenDayTime(mood, attrSched, day, hour){
	var weekend = false;
	var queryResult = [];

	if(day == "5" || day == "6"){ //If friday or saturday
		weekend = true;
	}

	if(weekend){
		queryResult.push(attrSched['weekend'][hour][mood]);
		queryResult.push(attrSched['weekend'][hour]['danceability']);
		return queryResult;
	}
	else{ //Weekday
		queryResult.push(attrSched['weekend'][hour][mood]);
		queryResult.push(null);
		return queryResult;
	}
}


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

// function acquireTokenToAccessUserPlaylists(){
// 	var str = spotifyClientID + ':' + spotifyClientSecret;
// 	var loginBase64 = btoa(str);
// 	console.log(loginBase64);
// 	searchUrl = "https://accounts.spotify.com/api/token?grant_type=authorization_code&code="+access_code+"&redirect_uri=http://localhost:8000/auth/&client_id="+spotifyClientID+"&client_secret="+spotifyClientSecret;
// 	$.ajax({
// 			type: "POST",
// 			// dataType: "jsonp",
// 			url: searchUrl,
// 			// beforeSend: function (xhr) {
//    //  		xhr.setRequestHeader ("Authorization", "Basic " + loginBase64);
// 			// 	},
// 			beforeSend: function(xhr) { 
// 				xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); },
// 			// 	xhr.setRequestHeader("Authorization", "Basic " + loginBase64); },
			
// 			success: function(response) {
// 				console.log(response);	
					
// 		    } 
// 	});
// }

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
		acquireTokenToAccessUserPlaylists();
	};
}





acquireAccessToSpotifyUserPlaylists();
