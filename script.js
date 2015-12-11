var key = "I8VH1VRNONS3DZD9F";

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
	searchByMood(mood);

}); 

function searchByMood(mood){
	if (mood == "christmas") {
		apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key=I8VH1VRNONS3DZD9F&format=json&song_type=christmas&min_tempo=200&max_tempo=250";
	} else {
		apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key=I8VH1VRNONS3DZD9F&format=json&mood="+mood+"&min_tempo=200&max_tempo=250";
	}
	$.ajax({
		type: "GET",
		url: apiUrl,
		success: function(data) {
			console.log(data);
			var n = Math.min(15, data['response']['songs'].length);
			var random = Math.floor((Math.random() * n));
			id = data['response']['songs'][random]['id']
			title = data['response']['songs'][random]['title']
			$(".song-info").remove();
			$("body").append('<p><span class="song-info"> id: ' + id + ' title: ' + title + ' </span>');  	
		}
	});
};