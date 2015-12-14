var key = "I8VH1VRNONS3DZD9F"; //Phil's key
// var key = "ENVDIG8W2BZ1H4OB0"; //Khal's key


// HTML5 storage function format: 
// 				localStorage.NewVariable = valueVar    or  var i = localStorage.SavedVariable

// 	another way to do the same as above:
// 			localStorage.setItem("NewVariable", valueVar) or  var i = localStorage.getItem("SavedVariable")
//
// IMPORTANT: localStorage stores everything as a String. You need to parse whatever you're pulling from storage.

console.log(localStorage.report);
console.log(localStorage.reportCSV);

// Reset all localStorage
if(true){ localStorage.clear();}

// Reset min_tempo count
if(false){ localStorage.min_tempo = null;}

// Iterate through all localStorage
if(false){
	console.log("local storage");
	for (var i = 0; i < localStorage.length; i++)   {
    	console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
	}
}

var incrementTempoBy = 10;
var maxSearchResults = 100;
var mood = null;

//Tempo Settings =========================
var min_tempo = localStorage.min_tempo;
if(min_tempo == null){ 
	console.log("min_tempo doesn't exist in localStorage");
	min_tempo = 0; }
else{
	min_tempo = parseInt(localStorage.min_tempo);
}
var max_tempo = min_tempo + incrementTempoBy;

//Danceability Settings =========================
var addDanceability = true; //In addition to mood, danceability will be set. This option will disable the danceability only emoji
var danceRnge = 0.8 //ex: 0.5 will set min to 0.4 and max to 0.6, not used for danceability only search.
var incrementDanceBy = 0.1;
var min_danceability;
var max_danceability;

if(addDanceability){
	min_danceability = Math.max((danceRnge - incrementDanceBy ), 0);
	max_danceability = Math.min((danceRnge + incrementDanceBy ), 1);
}
else {
	min_danceability = localStorage.min_danceability;
	if(min_danceability == null){ 
		console.log("min_danceability doesn't exist in localStorage");
		min_danceability = 0; }
	else{
		min_danceability = parseInt(localStorage.min_danceability);
	}
	max_danceability = min_danceability + incrementDanceBy;
}


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
	localStorage.mood = mood;
	if(mood=="dance" && !addDanceability){
		searchByDanceability();
	}
	else{
		searchByMood(mood);
	}
	
}); 

function searchByDanceability(){
	
	apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults;
	
	$.ajax({
		type: "GET",
		url: apiUrl,
		success: function(data) {
			//Save after a successful call
			localStorage.min_danceability = min_danceability;
			
			console.log(data);
			var results = data.response.songs.length;
			
			var report = "Danceability: Min="+min_danceability+" Max="+max_danceability+" / Results: "+results+"\n";
			var reportCSV = min_danceability+","+max_danceability+","+results+"\n";
			console.log(report);
			localStorage.report += report;
			localStorage.reportCSV += reportCSV
			
			min_danceability += incrementDanceBy;
			max_danceability = min_danceability + incrementDanceBy;
		}
	});
};

function searchByMood(mood){
	if (mood == "christmas") {
		apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&song_type=christmas&min_tempo="+min_tempo+"&max_tempo="+max_tempo+"&results="+maxSearchResults;
	} else if (addDanceability) {
		apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&mood="+mood+"&min_tempo="+min_tempo+"&max_tempo="+max_tempo+"&results="+maxSearchResults+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability;
	} else {
		apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&mood="+mood+"&min_tempo="+min_tempo+"&max_tempo="+max_tempo+"&results="+maxSearchResults;
	}
	$.ajax({
		type: "GET",
		url: apiUrl,
		success: function(data) {
			//Save after a successful call
			localStorage.min_tempo = min_tempo;
			var report;
			var reportCSV;
			console.log(data);
			var results = data.response.songs.length;
			
			if(addDanceability){
				report = "Mood: "+mood+ " / Tempo: Min="+min_tempo+" Max="+max_tempo+" / Results: "+results+" / Danceability: "+danceRnge+"\n";
				reportCSV = mood+","+min_tempo+","+max_tempo+","+results+","+danceRnge+"\n"; 
			}
			else{
				report = "Mood: "+mood+ " / Tempo: Min="+min_tempo+" Max="+max_tempo+" / Results: "+results+"\n";
				reportCSV = mood+","+min_tempo+","+max_tempo+","+results+"\n";
			}
			
			console.log(report);
			localStorage.report += report;
			localStorage.reportCSV += reportCSV
			
			min_tempo += incrementTempoBy;
			max_tempo = min_tempo + incrementTempoBy;
			
			if(data != null && data.response.songs.length > 0 ){
			var n = Math.min(maxSearchResults, data['response']['songs'].length);
			var random = Math.floor((Math.random() * n));
			id = data['response']['songs'][random]['id']
			title = data['response']['songs'][random]['title']
			$(".song-info").remove();
			$("body").append('<p><span class="song-info"> id: ' + id + ' title: ' + title + ' </span>'); 
			} 	
		}
	});
};

function testAPI (min_danceability,max_danceability) {
		min_danceability = parseFloat(min_danceability).toPrecision(2);
		max_danceability = parseFloat(max_danceability).toPrecision(2);
apiUrl = "http://developer.echonest.com/api/v4/song/search?api_key="+key+"&format=json&bucket=id:spotify&bucket=tracks&mood="+mood+"&min_energy="+min_energy+"&max_energy="+max_energy+"&min_danceability="+min_danceability+"&max_danceability="+max_danceability+"&results="+maxSearchResults;
$.ajax({
			type: "GET",
			url: apiUrl,
			success: function(data) {
			
				output3 = min_danceability+","+max_danceability+","+data['response']['songs'].length+"\n";
				// console.log(output3);
				localStorage.output += output3;
			}
		});
}