// schedules.js is loaded from index.html.
//   contains: energySched & tempoSched based on excel data 
//   access format: energySched['weekday']['3']['happy']
// 		or 	  tempoSched['weekend']['22']['danceability']
// Note: danceability access is only for weekends.


//Control Variables:
var maxSearchResults = 15; //Max is 100, controls Echo Nest results
var danceabilityRangeVari = 0.05; //controls Danceability range used
var energyRangeVari = 0.05; //controls energy range used


//Keys/Codes/Tokens
var key = ["I8VH1VRNONS3DZD9F","ENVDIG8W2BZ1H4OB0"]; //Khal's Echo Nest key
var access_code = null;
var spotifyClientID = "4e23da998a794a88bb254537f72d09f6";
var spotifyClientSecret = "8be49b8fdd454f50aeffba5126086fbf";

//Persistent variables
var currentSongEnergy; // Ensure that current song playing always updates this value
var userControls; // Set if user "takes control" of energy switch 
var direction; // "asc" or "desc" , set if userControls == true
var currentMode; // "mood" or "seed_song"
var playlistStorageInfo;  //tuples stored as [currentMood, currentPlaylistDateTime Stamp]
var playlistStorage;  // two dimensional array storing currentPlaylist[] as they are generated
var playlistStorageCount;
var currentMood;
var currentPlaylistDateTimeStamp;
var currentSongID;

//Non-persistent variables
var songsInCurrentPlaylist = []; //used for temp play widget functionality
var currentPlaylist = [];
var seed_song_id; // 
var mood_cache = {};
var counter = 1;
var seedSongAlbumImg = "";
var seedSongTitle = "";


function updateCurrentSongPlayingVariables(){
	//update all the variables here
}

// Reset all localStorage
if(false){ console.log("Cleared localStorage"); localStorage.clear(); }

// Iterate through all localStorage
if(false){
	console.log("local storage");
	for (var i = 0; i < localStorage.length; i++)   {
    	console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
	}
}

function loadImportantVariables(){

	if(localStorage['playlistStorage'] != undefined ){
		playlistStorage = JSON.parse(localStorage['playlistStorage']);
		//console.log(playlistStorage);
	} 	else{ playlistStorageInfo = [];	}

	if(localStorage['playlistStorageInfo'] != undefined){
		playlistStorageInfo = JSON.parse(localStorage['playlistStorageInfo']);
		//console.log(playlistStorageInfo);
	} else { playlistStorage = []; }

	if(localStorage['playlistStorageCount'] != undefined){
		playlistStorageCount = parseInt(localStorage['playlistStorageCount']);
		console.log(playlistStorageCount);

		//Load current playlist by getting the last playlist in the Storage
		currentPlaylist = playlistStorage[playlistStorageCount-1];
		//console.log(currentPlaylist);

	} else { playlistStorageCount = 0; }

	if(localStorage['currentSongEnergy'] != undefined){
		currentSongEnergy = localStorage['currentSongEnergy'];
	} else { currentSongEnergy = null; }

	if(localStorage['userControls'] != undefined){
		userControls = localStorage['userControls'];
	} else { userControls = false;  }

	if(localStorage['direction'] != undefined){
		direction = localStorage['direction'];
	} else { direction = null; }

	if(localStorage['currentMode'] != undefined){
		currentMode = localStorage['currentMode'];
	} else { currentMode = null; }

	if(localStorage['currentMood'] != undefined){
 		currentMood = localStorage['currentMood'];
	} else { currentMood = ""; }

	if(localStorage['currentPlaylistDateTimeStamp'] != undefined){
 		currentPlaylistDateTimeStamp = localStorage['currentPlaylistDateTimeStamp'];
	} else { currentPlaylistDateTimeStamp = ""; }

	console.log("PREP FOR LOADING");
	counter = maxSearchResults; //prep the queuePlaylistToUI() func
	queuePlaylistResultsThenReturnToUI();

}

function savePlaylistToStorage(){
	//Save currentplaylist to localstorage placeholder
	playlistStorage.push(currentPlaylist);
	playlistStorageCount++;

	//Save information about the playlist in a tuple and push it on 
	var temp = [];
	temp.push(currentMood);
	saveCurrentPlaylistDateTimeStamp();
	temp.push(currentPlaylistDateTimeStamp);
	playlistStorageInfo.push(temp);
	
	localStorage['playlistStorage'] = JSON.stringify(playlistStorage);
	localStorage['playlistStorageInfo'] = JSON.stringify(playlistStorageInfo);
	localStorage['playlistStorageCount'] = playlistStorageCount;

}

function saveImportantVariables(){

	savePlaylistToStorage();

	localStorage['currentSongEnergy'] = currentSongEnergy;
	localStorage['userControls'] = userControls;
	localStorage['direction'] = direction;
	localStorage['currentMode'] = currentMode;
	localStorage['currentMood'] = currentMood;
	localStorage['currentPlaylistDateTimeStamp'] = currentPlaylistDateTimeStamp;
}

function saveCurrentPlaylistDateTimeStamp(){
	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours() + 1;
	var minute = date.getMinutes();

	var dateTime = month+"/"+day+" at "+hour+":"+minute;
	console.log(dateTime);
	currentPlaylistDateTimeStamp = dateTime;
}

function swapKeys(){ //will be used if 429 error occurs.
	var temp;
	temp = key[0];
	key[0] = key[1];
	key[1] = temp;
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

$(".emoji").click(function(e){

	mood = $(this).attr("mood");
	$(".track").remove();

	if(mood=="dance"){
		saveImportantVariables();
	}
	else{
	createPlaylistFromMood(mood, []);
	console.log(currentMood);
	}
}); 

function energySwitchActuated(playlist_local_dict){
	//direction (asc/desc) already set by UI at this point.
	userControls == "true";
	console.log(playlist_local_dict);
	for(var i = 0; i < playlist_local_dict['songs'].length; i++){
		if (playlist_local_dict['songs'][i]['id'] == playlist_local_dict['currently_playing_song']){
			
			playlist_local_dict['songs'] = playlist_local_dict['songs'].splice(0, i+1);
			break;
		}
	}
	console.log(playlist_local_dict);
	currentSongEnergy = 0.8; 
	if(currentMode == "mood"){
		createPlaylistFromMood(mood, playlist_local_dict['songs']);
	} else if (currentMode == "seed_song"){
		seed_song_id = localstorage['seed_song_id'];
		createPlaylistFromSeedSong(seed_song_id, true, playlist_local_dict['songs']);
	}

}

function createPlayWidget(playlist_name){
	$("iframe").remove();
	trackIds = "";
	for (var i = 0; i < songsInCurrentPlaylist.length; i++){
		trackIds += songsInCurrentPlaylist[i] + ","
	}
	trackIds = trackIds.substring(0, trackIds.length - 1);
	console.log(trackIds);
	iframe = "<iframe src=\"https://embed.spotify.com/?uri=spotify:trackset:"+playlist_name+":" + trackIds +"\" width=\"300\" height=\"380\" frameborder=\"0\" allowtransparency=\"true\"></iframe>";
	//$("body").append(iframe);
	display_spotify_widget(iframe);
}

function searchByTitle(title){
	if(title!="" || title!=null){
	currentMode = "seed_song";
	saveImportantVariables();
	//seedSongTitle = title;
	searchUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key[0]+"&title="+title+"&bucket=tracks&sort=artist_familiarity-desc&bucket=id:spotify&limit=true"
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
					//console.log(song['album']);
					results.push(song);
					
				});
				//console.log(results);
				display_seed_suggestions(results);
			}
	});
}
}

// results is a list of song infos, structure specified in searchByTitle
// function display_seed_suggestions(results){

// }

//this function gets called upon each successful ajax 'complete'. Logic will 
function queuePlaylistResultsThenReturnToUI(){
	if(counter==maxSearchResults){
		console.log(currentPlaylist);
		console.log("FINISHED QUEUE");
		counter = 1;
		//createPlayWidget(currentMood);//setTimeout(function(){ createPlayWidget(currentMood); }, 2000);

		saveImportantVariables(); //Save state before sending results to UI/frontend
		// loadImportantVariables();
		var dataInArrayOfJSON = [];
		for (var i = 0; i < currentPlaylist.length; i++) {
			var temp = 
			{
				"id" : 	currentPlaylist[i][0],
				"cover_url" : currentPlaylist[i][1]['album']['images'][1]['url'],
				"preview_url" : currentPlaylist[i][1]['preview_url'],
				"title" : currentPlaylist[i][1]['name'],
				"artist" : currentPlaylist[i][1]['artists'][0]['name'],
				"album" : currentPlaylist[i][1]['album']['name'],
				"energy" : currentPlaylist[i][2]
			}
			//console.log(temp);
			dataInArrayOfJSON.push(temp);
		};

		//Determine if search is mood or song_title 
		var tempMode;
		var tempTitle;
		//console.log(currentMood);
		//console.log(currentMode);
		if(currentMode=="mood") { 
			tempMode = "emoji";
			tempTitle = currentMood; } 
		else { 
			tempMode = "seed";
			tempTitle = seedSongTitle;	}

		var songImg;
		if(seedSongAlbumImg!=null){ songImg = seedSongAlbumImg; } else { songImg = "http://3dfs.com/wp-content/uploads/revslider/Opus-rev-display/opus-cd-disc-300x300.png";}
		//console.log("temp title:")
		//console.log(tempTitle);
		console.log(dataInArrayOfJSON);
		var playlistToDisplay = 
		{ 
			"id" : playlistStorageCount , //*the id of the playlist in the storage*, 
  			"currently_playing_song" : dataInArrayOfJSON[0]['id'], //Sync up with global??? For now, just take first song
 			"songs": dataInArrayOfJSON, //*array under the form:* [[id, cover_url, preview_url, title, artist, album, year, position_in_the_playlist], ...]
 			"mode" : tempMode,
 			"img" : songImg,
 			"title" : tempTitle,
 			"timestamp" : currentPlaylistDateTimeStamp
		}
		console.log(playlistToDisplay);
		//console.log(playlistToDisplay);
		localStorage['playlist_local_dict'] = JSON.stringify(playlistToDisplay);
		display_playlist(playlistToDisplay);
	}
	else{ counter++;}
	
}

function getAlbumImageForSeedSongResult(artistId){
	$.ajax({
			type: "GET",
			url: 'https://api.spotify.com/v1/artists/'+artistId+'/albums',
			success: function(data) {
				seedSongAlbumImg = data['items'][0]['images'][1]['url'];
			},
			error: function(error){ console.log(error); }
		});
}

function createPlaylistFromSeedSong(seedId, isInitialPlaylist, songsToKeepInPlaylist){
	songsInCurrentPlaylist = [];
	//currentMood = seedId;
	currentMode = "seed_song";
	//console.log("set mode as seed song");
	currentPlaylist = []; //reset the currentPlaylist if searching for new one.
	mood_cache[currentMood] = [];
	incrementEnergyBy = 0.04; //temp control for tesing
	saveImportantVariables();
	
	console.log(songsToKeepInPlaylist);
	for (var i = 0; i < songsToKeepInPlaylist.length; i++){
		searchByTrackId(songsToKeepInPlaylist[i]['id'], songsToKeepInPlaylist[i]['energy']);
		songsInCurrentPlaylist.push(songsToKeepInPlaylist[i]['id']);
	} 

	console.log("seed id: " + seedId);

	song_type_url = "http://developer.echonest.com/api/v4/song/profile?api_key="+key[0]+"&format=json&id="+seedId+"&bucket=song_type&bucket=audio_summary&bucket=id:spotify&bucket=tracks";
	$.ajax({
			type: "GET",
			url: song_type_url,
			success: function(data) {
				//console.log('seed song info:')
				//console.log(data);
				var spotifyArtistId = data['response']['songs'][0]['artist_foreign_ids'][0]['foreign_id'].split(":")[2];
				getAlbumImageForSeedSongResult(spotifyArtistId);
				seedSongTitle = data['response']['songs'][0]['title'];
				currentSongEnergy = data['response']['songs'][0]['audio_summary']['energy'];
				artistId = data['response']['songs'][0]['artist_id'];
				
				genreSearchUrl = "http://developer.echonest.com/api/v4/artist/terms?api_key="+key[0]+"&id="+artistId+"&format=json";
				$.ajax({
					type: "GET",
					url: genreSearchUrl,
					success: function(artistData) {
						genre = artistData['response']['terms'][0]['name'];
						currentMood = genre;
						//console.log(genre);
						seedValue = getAttributeFromCurrentDateTime("happy",energySched); //Returns: array with three elements [energyValue, danceabilityValue, "asc"/"desc"]
						direction = seedValue[2];
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
							danceability = null;
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

							similarSongUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key[0]+""+types+"&bucket=id:spotify&limit=true&bucket=tracks&bucket=audio_summary&style="+genre+
							"&min_energy="+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&sort=energy-"+direction+"&results=" + maxSearchResults;
							$.ajax({
								type: "GET",
								url: similarSongUrl,
								success: function(data) {
									console.log(data);
									var n = Math.min(maxSearchResults, data['response']['songs'].length);
									var random = Math.floor((Math.random() * n));
									id = data['response']['songs'][random]['tracks'][0]['foreign_id']
									song_id = id.split(":")[2];
									console.log(songsInCurrentPlaylist);
									while(contains(songsInCurrentPlaylist, song_id)){
										random = Math.floor((Math.random() * n));
										id = data['response']['songs'][random]['tracks'][0]['foreign_id'];	
										song_id = id.split(":")[2];
										console.log('duplicate detected');
									}

									var energyOfSelectedSong = data['response']['songs'][random]['audio_summary']['energy'];
									searchByTrackId(song_id, energyOfSelectedSong); 
									songsInCurrentPlaylist.push(song_id);	
									createPlayWidget("seedSongTitle");
								}
							});
						}
					}
				});
			}
	});

}


function createPlaylistFromMood(mood, songsToKeepInPlaylist){
	songsInCurrentPlaylist = [];
	currentPlaylist = []; //reset the currentPlaylist if searching for new one.
	currentMood = mood;
	currentMode = "mood";
	var seedValue = getAttributeFromCurrentDateTime(mood,energySched);
	var incrementEnergyBy = 0.04; //temp control for tesing
	saveImportantVariables();
	//console.log("set current mode as mood");
	if (false) {

		console.log('cached')
		console.log(mood_cache[mood])
		for(var i = 0; i < mood_cache[mood].length; i++){
			display_search_song(mood_cache[mood][i]['name'],  mood_cache[mood][i]['artists'][0]['name'], mood_cache[mood][i]['album']['name'], 
						mood_cache[mood][i]['album']['images'][1]['url'], mood_cache[mood][i]['preview_url'] );
		}
	} else {
		mood_cache[mood] = [];
		//console.log(seedValue);
		console.log(songsToKeepInPlaylist);
		for (var i = 0; i < songsToKeepInPlaylist.length; i++){
			searchByTrackId(songsToKeepInPlaylist[i]['id'], songsToKeepInPlaylist[i]['energy']);
			songsInCurrentPlaylist.push(songsToKeepInPlaylist[i]['id']);
		}

		for(var i = 0; i < maxSearchResults; i++) {
			if(direction == null){ direction = "desc";} 
			if(direction == "desc") incrementEnergyBy = -0.04;
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
 			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key[0]+"&format=json&song_type=christmas&bucket=audio_summary&bucket=id:spotify&limit=true&bucket=tracks&min_energy="
 				+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults; 
 			} else {
 			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key[0]+"&format=json&bucket=audio_summary&bucket=id:spotify&limit=true&bucket=tracks&mood="+mood+"&min_energy="+min_energy+"&max_energy="
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
					console.log(songsInCurrentPlaylist);
					while(contains(songsInCurrentPlaylist, song_id)){
						random = Math.floor((Math.random() * n));
						id = data['response']['songs'][random]['tracks'][0]['foreign_id'];	
						song_id = id.split(":")[2];
						console.log('duplicate detected');
					}

					//console.log(data);
					var energyOfSelectedSong = data['response']['songs'][random]['audio_summary']['energy'];
					searchByTrackId(song_id, energyOfSelectedSong); 
					songsInCurrentPlaylist.push(song_id);	
					// createPlayWidget(mood);
					}
			});
		}
	}
};

function contains(playlist, id){
	for (var i = 0; i < playlist.length; i++){
		//console.log('comparing ' + playlist[i] + " and " + id);
		if (playlist[i] == id){
			return true;
		}
	}
	return false;
}
/*
A record is created using an array with the following tuple: [spotifyTrackid, dataJsonObject, energy, songAlreadyPlayedBoolean]
*/
function addTrackToLocalStorage(id, data, energy){
	var record = [];
	record.push(id);
	record.push(data);
	record.push(energy);
	record.push(false);

	currentPlaylist.push(record);
	//console.log("added record");
	//console.log(currentPlaylist);
	
}

function searchByTrackId(id, energy){
	console.log(id);
	searchUrl = "https://api.spotify.com/v1/tracks/" + id
	if (!(currentMood in mood_cache)) { mood_cache[currentMood] = [];}
	$.ajax({
			type: "GET",
			url: searchUrl,
			success: function(data) {
				/*console.log(data);	
					display_search_song(data['name'],  data['artists'][0]['name'], data['album']['name'], 
						data['album']['images'][1]['url'], data['preview_url'] ); */
					if(data['preview_url']!= null){
					addTrackToLocalStorage(id, data, energy);
					mood_cache[currentMood].push(data);
				}
		    }, 
			complete: function(){

				queuePlaylistResultsThenReturnToUI();
			}  
	});
}

/*function display_search_song(song_name, artist, album, album_cover, preview_url){
$("body").append(
	'<div class="track"> ' +
		'<p>' + song_name + '</p>' +
		'<p>' + artist + '</p>' +
		'<p>' + album + '</p>' +
		'<img class = "album-img" data-preview-url="' + preview_url + 
			'" src="' + album_cover + '"/>' +
	'</div>');	
}*/

/*********************
Given a mood and a json object containing the schedule, this function will return the seed attribute value
Usage: getAttributeFromCurrentDateTime("happy",energySched);
Returns: array with three elements [energyValue, danceabilityValue, "asc"/"desc"]
NOTE: if it's a weekday, danceability element will be null
***********************/
function getAttributeFromCurrentDateTime(mood, attrSched ){
	var date = new Date();
	var day = date.getDay(); //returns day of the week (from 0-6, Sun-Sat)
	var hour = date.getHours(); // returns the hour (from 0-23, 12am-11pm)
	var weekend = false;
	var queryResult = [];
	var tempDirection;

	if(day == "5" || day == "6"){ //If friday or saturday
		weekend = true;
	}

	var nextHour;
	if(hour==23){ nextHour = 0; } else { nextHour = hour+1;}

	if(weekend){
		queryResult.push(attrSched['weekend'][hour][mood]);
		queryResult.push(attrSched['weekend'][hour]['danceability']);
		if((queryResult[0] - attrSched['weekend'][nextHour][mood]) < 0 ){ tempDirection = "desc";} else { tempDirection= "asc";}
		queryResult.push(tempDirection);
		return queryResult;
	}
	else{ //Weekday
		queryResult.push(attrSched['weekday'][hour][mood]);
		queryResult.push(null);
		if((queryResult[0] - attrSched['weekday'][nextHour][mood]) < 0 ){ tempDirection = "desc";} else { tempDirection= "asc";}
		queryResult.push(tempDirection);
		return queryResult;
	}
}

/*********************
Similar to  getAttributeFromCurrentDateTime except this func will search with a 
given day (from 0-6, Sun-Sat) and hour (from 0-23, 12am-11pm), both strings.
Usage: getAttributeWithGivenDayTime("happy", energySched, "0", "23")
Returns: array with three elements [energyValue, danceabilityValue, "asc"/"desc"]
**********************/
function getAttributeWithGivenDayTime(mood, attrSched, day, hour){
	var weekend = false;
	var queryResult = [];

	if(day == "5" || day == "6"){ //If friday or saturday
		weekend = true;
	}

	var nextHour;
	if(hour==23){ nextHour = 0; } else { nextHour = hour+1;}

	if(weekend){
		queryResult.push(attrSched['weekend'][hour][mood]);
		queryResult.push(attrSched['weekend'][hour]['danceability']);
		if((queryResult[0] - attrSched['weekend'][nextHour][mood]) < 0 ){ tempDirection = "desc";} else { tempDirection= "asc";}
		queryResult.push(tempDirection);
		return queryResult;
	}
	else{ //Weekday
		queryResult.push(attrSched['weekday'][hour][mood]);
		queryResult.push(null);
		if((queryResult[0] - attrSched['weekday'][nextHour][mood]) < 0 ){ tempDirection = "desc";} else { tempDirection= "asc";}
		queryResult.push(tempDirection);
		return queryResult;
	}
}

function get_url_emoji(mood){
	if (mood == "happy") return "http://emojipedia-us.s3.amazonaws.com/cache/03/d8/03d88d5b2ec7a7fdad3b4434400d83dc.png";
	if (mood == "humorous") return "http://emojipedia-us.s3.amazonaws.com/cache/ed/4c/ed4ceffc5f3d397b6af25e6be051834f.png";
	if (mood == "sad") return "http://emojipedia-us.s3.amazonaws.com/cache/a5/c2/a5c21f2d49cb4c413451b330f756dceb.png";
	if (mood == "dreamy") return "http://emojipedia-us.s3.amazonaws.com/cache/6e/81/6e815c76abfd47c5f0bfe11596f4c71b.png";
	if (mood == "angry") return "http://emojipedia-us.s3.amazonaws.com/cache/0a/7f/0a7f34530f9443cde7fc3b4e6d782297.png";
	if (mood == "romantic") return "http://emojipedia-us.s3.amazonaws.com/cache/23/a6/23a66b6148a653b05f0b79a6c9ba25f7.png" ;
	if (mood == "dancing") return "http://emojipedia-us.s3.amazonaws.com/cache/54/5b/545bd7770c2da4afe6763fd10ca2d9d0.png";
	if (mood == "christmas") return "http://emojipedia-us.s3.amazonaws.com/cache/b4/45/b445b936d65f593287d14b8f66709135.png" ;
}

/*********
Code for QueryString from http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
Used to extract the token information after a spotify user allows access to personal Spotify account. We need
this functionality to manipulate the Spotify playlist (for exporting)
*********/
// var QueryString = function () {
//   // This function is anonymous, is executed immediately and 
//   // the return value is assigned to QueryString!
//   var query_string = {};
//   var query = window.location.search.substring(1);
//   var vars = query.split("&");
//   for (var i=0;i<vars.length;i++) {
//     var pair = vars[i].split("=");
//         // If first entry with this name
//     if (typeof query_string[pair[0]] === "undefined") {
//       query_string[pair[0]] = decodeURIComponent(pair[1]);
//         // If second entry with this name
//     } else if (typeof query_string[pair[0]] === "string") {
//       var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
//       query_string[pair[0]] = arr;
//         // If third or later entry with this name
//     } else {
//       query_string[pair[0]].push(decodeURIComponent(pair[1]));
//     }
//   } 
//     return query_string;
// }();

//used to get the token to access a user's playlists
// function sendToSpotifyUserAuthorizationPage(){
// 	searchUrl = "https://accounts.spotify.com/authorize?client_id="+spotifyClientID+"&response_type=code&redirect_uri=http://localhost:8000/auth/";
// 	window.location.replace(searchUrl);
// }

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

// function acquireAccessToSpotifyUserPlaylists() {
// 	if(QueryString['code']==undefined){
// 		sendToSpotifyUserAuthorizationPage(); }
// 		access_code = QueryString['code'];
// 		console.log(access_code);
// 		if (QueryString['error'] != undefined) { 
// 			alert("Please allow access to your Spotify account in order to user MusicFlux.");
// 			window.location.replace("http://localhost:8000/auth/");
// 		}
// 	else {
// 		acquireTokenToAccessUserPlaylists();
// 	};
//}

loadImportantVariables();

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