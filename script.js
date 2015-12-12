var key = "I8VH1VRNONS3DZD9F";
var mood_cache = {};

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
	for(var i = 0; i < 10; i++){
		createPlaylistFromMood(mood, i, .1 + i*.07);
	}
	createPlaylistFromSeedSong("SOUKOUX12B0B80B0BA");
}); 

function createPlaylistFromSeedSong(seedId){
	song_type_url = "http://developer.echonest.com/api/v4/song/profile?api_key=I8VH1VRNONS3DZD9F&format=json&id="+seedId+"&bucket=song_type&bucket=audio_summary";
	$.ajax({
			type: "GET",
			url: song_type_url,
			success: function(data) {
				console.log(data);
				artistId = data['response']['songs'][0]['artist_id'];
				genreSearchUrl = "http://developer.echonest.com/api/v4/artist/terms?api_key=I8VH1VRNONS3DZD9F&id="+artistId+"&format=json";
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
						similarSongUrl = "http://developer.echonest.com/api/v4/song/search?api_key=I8VH1VRNONS3DZD9F"+types+"&style="+genre+"&min_energy="+energy+"&sort=energy-asc";
						$.ajax({
							type: "GET",
							url: similarSongUrl,
							success: function(data) {
								console.log(data);
							}
						});

					}
				});
			}
	});

}

function createPlaylistFromMood(mood, i, energy){
	if (mood in mood_cache && i < mood_cache[mood].length) {
		id = mood_cache[mood][i]['id']
		title = mood_cache[mood][i]['title']
		$("body").append('<p><span class="song-info"> id: ' + id + ' title: ' + title + ' </span>');  
	} else {
		mood_cache[mood] = [];
		min_energy = energy - .05;
		max_energy = energy + .05;
		if (mood == "christmas") {
			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key=I8VH1VRNONS3DZD9F&format=json&song_type=christmas&min_energy="+min_energy+"&max_energy="+max_energy;
		} else {
			apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key=I8VH1VRNONS3DZD9F&format=json&mood="+mood+"&min_energy="+min_energy+"&max_energy="+max_energy;
		}
		$.ajax({
			type: "GET",
			url: apiUrl,
			success: function(data) {
				console.log(data);
				var n = Math.min(15, data['response']['songs'].length);
				var random = Math.floor((Math.random() * n));
				mood_cache[mood].push(data['response']['songs'][random]);
				id = data['response']['songs'][random]['id']
				title = data['response']['songs'][random]['title']
				$("body").append('<p><span class="song-info"> id: ' + id + ' title: ' + title + ' </span>');  	
			}
		});
	}
};