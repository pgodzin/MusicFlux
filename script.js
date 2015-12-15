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

var key = "I8VH1VRNONS3DZD9F"; //Phil's Echo Nest key
// var key = "ENVDIG8W2BZ1H4OB0"; //Khal's Echo Nest key

var currentSongEnergy = null; // Ensure that current song playing always updates this value
var userControls = false; // Set if user "takes control" of energy switch 
var direction = null; // "asc" or "desc" , set if userControls == true
var currentMode = null; // "mood" or "seed_song"
var seed_song_id = null; // 

var mood_cache = {};
var currMood = "";

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
	//createPlaylistFromMood(mood, .1);
	createPlaylistFromSeedSong("SOUKOUX12B0B80B0BA", true);
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

function createPlaylistFromSeedSong(seedId, isInitialPlaylist){
	currMood = "none";
	mood_cache[currMood] = [];
	direction = "asc"; // TODO: replace with get
	currentSongEnergy = .5; // TODO: don't set here
	if (direction == "asc")
		minOrMax = "min";
	else minOrMax = "max";
	song_type_url = "http://developer.echonest.com/api/v4/song/profile?api_key="+key+"&format=json&id="+seedId+"&bucket=song_type&bucket=audio_summary&bucket=id:spotify&bucket=tracks";
	$.ajax({
			type: "GET",
			url: song_type_url,
			success: function(data) {
				console.log(data);
				artistId = data['response']['songs'][0]['artist_id'];
				genreSearchUrl = "http://developer.echonest.com/api/v4/artist/terms?api_key="+key+"&id="+artistId+"&format=json";
				$.ajax({
					type: "GET",
					url: genreSearchUrl,
					success: function(artistData) {
						genre = artistData['response']['terms'][0]['name'];
						console.log(genre);
						song_type = data['response']['songs'][0]['song_type'];
						if (isInitialPlaylist) energy = currentSongEnergy;
						else  energy = data['response']['songs'][0]['audio_summary']['energy'];
					
						types = "";
						for (var i = 0; i < song_type.length; i++){
							types += "&song_type=" + song_type[i];
						}
						similarSongUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+""+types+"&bucket=id:spotify&bucket=tracks&style="+genre+"&"+minOrMax+"_energy="+energy+"&sort=energy-"+direction+"&results=" + maxSearchResults;
						$.ajax({
							type: "GET",
							url: similarSongUrl,
							success: function(data) {
								console.log(data);
								$.each(data['response']['songs'], function(i, l){
									if (l['tracks'].length == 0){
										console.log(l['title'] + ' not on spotify');
									} else {
										id = l['tracks'][0]['foreign_id']
										song_id = id.split(":")[2];
										data = searchByTrackId(song_id);  
									}
								});
							}
						});

					}
				});
			}
	});

}

function createPlaylistFromMood(mood){
	currMood = mood;
	var seedValue = getAttributeFromCurrentDateTime(mood,energySched);
	var incrementEnergyBy = 0.05; //temp control for tesing
	if (mood in mood_cache) {

		console.log('cached')
		console.log(mood_cache[mood])
		for(var i = 0; i < mood_cache[mood].length; i++){
			display_search_songs(mood_cache[mood][i]['name'],  mood_cache[mood][i]['artists'][0]['name'], mood_cache[mood][i]['album']['name'], 
						mood_cache[mood][i]['album']['images'][1]['url'], mood_cache[mood][i]['preview_url'] );
		}
	} else {
		mood_cache[mood] = [];
		console.log(seedValue);
		for(var i = 0; i < maxSearchResults; i++) {
			if(direction == "desc") i *= -1;
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
				min_energy = Math.max( Math.min(0.0, (energy - energyRangeVari)), 0.0);
				max_energy = Math.min( Math.max(1.0, (energy + energyRangeVari)), 1.0);
				//console.log(min_energy);
				//console.log(max_energy);
			}

			//console.log("Min Energy: "+min_energy+" / Max Energy: "+max_energy+" / Min Danceability:  "+min_danceability+" / Max Danceability: "+max_danceability); 

			if (mood == "christmas") {
 			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&song_type=christmas&bucket=id:spotify&bucket=tracks&min_energy="
 				+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults; 
 			} else {
 			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&bucket=id:spotify&bucket=tracks&mood="+mood+"&min_energy="+min_energy+"&max_energy="
 				+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults; 			
 			}
			$.ajax({
				type: "GET",
				url: apiUrl,
				success: function(data) {
					console.log(data);
					var n = Math.min(maxSearchResults, data['response']['songs'].length);
					var random = Math.floor((Math.random() * n));
					while(data['response']['songs'][random]['tracks'].length == 0){
						random = Math.floor((Math.random() * n));
						console.log('no spotify id');
					}
					id = data['response']['songs'][random]['tracks'][0]['foreign_id']
					
					song_id = id.split(":")[2];
					searchByTrackId(song_id); 
						
				}
			});
		}
	}
};

function searchByTrackId(id){
	searchUrl = "https://api.spotify.com/v1/tracks/" + id
	$.ajax({
			type: "GET",
			url: searchUrl,
			success: function(data) {
				console.log(data);	
					display_search_songs(data['name'],  data['artists'][0]['name'], data['album']['name'], 
						data['album']['images'][1]['url'], data['preview_url'] );

					mood_cache[currMood].push(data);
		    } 
	});
}

function display_search_songs(song_name, artist, album, album_cover, preview_url){
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
returns: array with two elements [energyValue, danceabilityValue]
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