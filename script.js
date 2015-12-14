/* schedules.js is loaded from index.html.
   contains: energySched & tempoSched based on excel data 
   access format: energySched['weekday']['3']['happy']
			or 	  tempoSched['weekend']['22']['danceability']
	Note: danceability access is only for weekends.
 */

//Control Variables:
var maxSearchResults = 30; //Max is 100, controls Echo Nest results
var danceabilityRangeVari = 0.05; //controls Danceability range used
var energyRangeVari = 0.05; //controls energy range used

var key = "I8VH1VRNONS3DZD9F"; //Phil's Echo Nest key
// var key = "ENVDIG8W2BZ1H4OB0"; //Khal's Echo Nest key

var mood_cache = {};
var mood = null;



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
	$(".song-info").remove();

	var seedValue = getAttributeFromCurrentDateTime(mood,energySched);
	console.log("Seed Value: "+ seedValue);
	
	var incrementEnergyBy = 0.07; //temp control for tesing

	for(var i = 0; i < 10; i++){
		var energy = seedValue[0] + (i * incrementEnergyBy);
		console.log("Energy Value: "+ energy);
		if(energy > (1.0 - incrementEnergyBy)){ break; } // temp control for testing
		createPlaylistFromMood(mood, i, energy, seedValue[1]);
	}
	createPlaylistFromSeedSong("SOUKOUX12B0B80B0BA");
}); 

function createPlaylistFromSeedSong(seedId){
	song_type_url = "http://developer.echonest.com/api/v4/song/profile?api_key="+key+"&format=json&id="+seedId+"&bucket=song_type&bucket=audio_summary&bucket=id:spotify&bucket=tracks"+"&results="+maxSearchResults;
	$.ajax({
			type: "GET",
			url: song_type_url,
			success: function(data) {
				console.log(data);
				artistId = data['response']['songs'][0]['artist_id'];
				genreSearchUrl = "http://developer.echonest.com/api/v4/artist/terms?api_key="+key+"&id="+artistId+"&format=json"+"&results="+maxSearchResults;
				$.ajax({
					type: "GET",
					url: genreSearchUrl,
					success: function(artistData) {
						genre = artistData['response']['terms'][0]['name'];
						console.log(genre);
						song_type = data['response']['songs'][0]['song_type'];
						energy = data['response']['songs'][0]['audio_summary']['energy'];
					
						types = "";
						for (var i = 0; i < song_type.length; i++){
							types += "&song_type=" + song_type[i];
						}
						similarSongUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+""+types+"&bucket=id:spotify&bucket=tracks&style="+genre+"&min_energy="+energy+"&sort=energy-asc&results="+maxSearchResults;
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
										title =l['title']
										artist = l['artist_name'];
										$("body").append('<p><span class="song-info"> similar song spotify id: ' + id + ' title: ' + title + ' by ' + artist + ' </span>');  
									}
								});
							}
						});

					}
				});
			}
	});

}

function createPlaylistFromMood(mood, i, energy, danceability){
	
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
		min_energy = Math.max( (energy - energyRangeVari), 0.0);
		max_energy = Math.min( (energy + energyRangeVari), 1.0)
	}

	console.log("Min Energy: "+min_energy+" / Max Energy: "+max_energy+" / Min Danceability:  "+min_danceability+" / Max Danceability: "+max_danceability);

	if (mood in mood_cache && i < mood_cache[mood].length) {
		console.log('cached')
		id = mood_cache[mood][i]['tracks'][0]['foreign_id']
		title = mood_cache[mood][i]['title']
		$("body").append('<p><span class="song-info"> spotify id: ' + id + ' title: ' + title + ' </span>');  
	} else {
		mood_cache[mood] = [];
		
		if (mood == "christmas") {
			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&song_type=christmas&bucket=id:spotify&bucket=tracks&min_energy="+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults;
		} else {
			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&bucket=id:spotify&bucket=tracks&mood="+mood+"&min_energy="+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults;
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
				mood_cache[mood].push(data['response']['songs'][random]);
				title = data['response']['songs'][random]['title']
				$("body").append('<p><span class="song-info"> spotify id: ' + id + ' title: ' + title + ' </span>');  	
			}
		});
	}
};

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





