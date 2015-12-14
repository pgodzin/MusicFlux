/* 
   contains: energySched & tempoSched based on excel data 
   access format: energySched['weekday']['3']['happy']
			or 	  tempoSched['weekend']['22']['danceability']
	Note: danceability access is only for weekends.
 */

var energySched = 

{"weekday": 
{
	"3": {
		"happy":0.54,
		"humorous":0.44,
		"sad":0.04,
		"dreamy":0.04,
		"angry":0.54,
		"romantic":0.26,
		"dancing":0.63,
		"christmas":0.08
	},
	"4": {
		"happy":0.58,
		"humorous":0.48,
		"sad":0.08,
		"dreamy":0.08,
		"angry":0.58,
		"romantic":0.32,
		"dancing":0.67,
		"christmas":0.17
	},
	"5": {
		"happy":0.63,
		"humorous":0.53,
		"sad":0.13,
		"dreamy":0.13,
		"angry":0.63,
		"romantic":0.38,
		"dancing":0.7,
		"christmas":0.25
	},
	"6": {
		"happy":0.67,
		"humorous":0.57,
		"sad":0.17,
		"dreamy":0.17,
		"angry":0.67,
		"romantic":0.43,
		"dancing":0.73,
		"christmas":0.33
	},
	"7": {
		"happy":0.71,
		"humorous":0.61,
		"sad":0.21,
		"dreamy":0.21,
		"angry":0.71,
		"romantic":0.49,
		"dancing":0.77,
		"christmas":0.42
	},
	"8": {
		"happy":0.75,
		"humorous":0.65,
		"sad":0.25,
		"dreamy":0.25,
		"angry":0.75,
		"romantic":0.55,
		"dancing":0.8,
		"christmas":0.5
	},
	"9": {
		"happy":0.79,
		"humorous":0.69,
		"sad":0.29,
		"dreamy":0.29,
		"angry":0.79,
		"romantic":0.61,
		"dancing":0.83,
		"christmas":0.58
	},
	"10": {
		"happy":0.83,
		"humorous":0.73,
		"sad":0.33,
		"dreamy":0.33,
		"angry":0.83,
		"romantic":0.67,
		"dancing":0.87,
		"christmas":0.67
	},
	"11": {
		"happy":0.88,
		"humorous":0.78,
		"sad":0.38,
		"dreamy":0.38,
		"angry":0.88,
		"romantic":0.73,
		"dancing":0.9,
		"christmas":0.75
	},
	"12": {
		"happy":0.92,
		"humorous":0.82,
		"sad":0.42,
		"dreamy":0.42,
		"angry":0.92,
		"romantic":0.78,
		"dancing":0.93,
		"christmas":0.83
	},
	"13": {
		"happy":0.96,
		"humorous":0.86,
		"sad":0.46,
		"dreamy":0.46,
		"angry":0.96,
		"romantic":0.84,
		"dancing":0.97,
		"christmas":0.92
	},
	"14": {
		"happy":1,
		"humorous":0.9,
		"sad":0.5,
		"dreamy":0.5,
		"angry":1,
		"romantic":0.9,
		"dancing":1,
		"christmas":1
	},
	"15": {
		"happy":0.96,
		"humorous":0.86,
		"sad":0.46,
		"dreamy":0.46,
		"angry":0.96,
		"romantic":0.84,
		"dancing":0.97,
		"christmas":0.92
	},
	"16": {
		"happy":0.92,
		"humorous":0.82,
		"sad":0.42,
		"dreamy":0.42,
		"angry":0.92,
		"romantic":0.78,
		"dancing":0.93,
		"christmas":0.83
	},
	"17": {
		"happy":0.88,
		"humorous":0.78,
		"sad":0.38,
		"dreamy":0.38,
		"angry":0.88,
		"romantic":0.73,
		"dancing":0.9,
		"christmas":0.75
	},
	"18": {
		"happy":0.83,
		"humorous":0.73,
		"sad":0.33,
		"dreamy":0.33,
		"angry":0.83,
		"romantic":0.67,
		"dancing":0.87,
		"christmas":0.67
	},
	"19": {
		"happy":0.79,
		"humorous":0.69,
		"sad":0.29,
		"dreamy":0.29,
		"angry":0.79,
		"romantic":0.61,
		"dancing":0.83,
		"christmas":0.58
	},
	"20": {
		"happy":0.75,
		"humorous":0.65,
		"sad":0.25,
		"dreamy":0.25,
		"angry":0.75,
		"romantic":0.55,
		"dancing":0.8,
		"christmas":0.5
	},
	"21": {
		"happy":0.71,
		"humorous":0.61,
		"sad":0.21,
		"dreamy":0.21,
		"angry":0.71,
		"romantic":0.49,
		"dancing":0.77,
		"christmas":0.42
	},
	"22": {
		"happy":0.67,
		"humorous":0.57,
		"sad":0.17,
		"dreamy":0.17,
		"angry":0.67,
		"romantic":0.43,
		"dancing":0.73,
		"christmas":0.33
	},
	"23": {
		"happy":0.63,
		"humorous":0.53,
		"sad":0.13,
		"dreamy":0.13,
		"angry":0.63,
		"romantic":0.38,
		"dancing":0.7,
		"christmas":0.25
	},
	"0": {
		"happy":0.58,
		"humorous":0.48,
		"sad":0.08,
		"dreamy":0.08,
		"angry":0.58,
		"romantic":0.32,
		"dancing":0.67,
		"christmas":0.17
	},
	"1": {
		"happy":0.54,
		"humorous":0.44,
		"sad":0.04,
		"dreamy":0.04,
		"angry":0.54,
		"romantic":0.26,
		"dancing":0.63,
		"christmas":0.08
	},
	"2": {
		"happy":0.5,
		"humorous":0.4,
		"sad":0,
		"dreamy":0,
		"angry":0.5,
		"romantic":0.2,
		"dancing":0.6,
		"christmas":0
	}
}

, "weekend": 
{
	"13": {
		"happy":0.54,
		"humorous":0.44,
		"sad":0.04,
		"dreamy":0.04,
		"angry":0.54,
		"romantic":0.26,
		"dancing":0.63,
		"christmas":0.08,
		"danceability":0.45
	},
	"14": {
		"happy":0.58,
		"humorous":0.48,
		"sad":0.08,
		"dreamy":0.08,
		"angry":0.58,
		"romantic":0.32,
		"dancing":0.67,
		"christmas":0.17,
		"danceability":0.5
	},
	"15": {
		"happy":0.63,
		"humorous":0.53,
		"sad":0.13,
		"dreamy":0.13,
		"angry":0.63,
		"romantic":0.38,
		"dancing":0.7,
		"christmas":0.25,
		"danceability":0.55
	},
	"16": {
		"happy":0.67,
		"humorous":0.57,
		"sad":0.17,
		"dreamy":0.17,
		"angry":0.67,
		"romantic":0.43,
		"dancing":0.73,
		"christmas":0.33,
		"danceability":0.6
	},
	"17": {
		"happy":0.71,
		"humorous":0.61,
		"sad":0.21,
		"dreamy":0.21,
		"angry":0.71,
		"romantic":0.49,
		"dancing":0.77,
		"christmas":0.42,
		"danceability":0.65
	},
	"18": {
		"happy":0.75,
		"humorous":0.65,
		"sad":0.25,
		"dreamy":0.25,
		"angry":0.75,
		"romantic":0.55,
		"dancing":0.8,
		"christmas":0.5,
		"danceability":0.7
	},
	"19": {
		"happy":0.79,
		"humorous":0.69,
		"sad":0.29,
		"dreamy":0.29,
		"angry":0.79,
		"romantic":0.61,
		"dancing":0.83,
		"christmas":0.58,
		"danceability":0.75
	},
	"20": {
		"happy":0.83,
		"humorous":0.73,
		"sad":0.33,
		"dreamy":0.33,
		"angry":0.83,
		"romantic":0.67,
		"dancing":0.87,
		"christmas":0.67,
		"danceability":0.8
	},
	"21": {
		"happy":0.88,
		"humorous":0.78,
		"sad":0.38,
		"dreamy":0.38,
		"angry":0.88,
		"romantic":0.73,
		"dancing":0.9,
		"christmas":0.75,
		"danceability":0.85
	},
	"22": {
		"happy":0.92,
		"humorous":0.82,
		"sad":0.42,
		"dreamy":0.42,
		"angry":0.92,
		"romantic":0.78,
		"dancing":0.93,
		"christmas":0.83,
		"danceability":0.9
	},
	"23": {
		"happy":0.96,
		"humorous":0.86,
		"sad":0.46,
		"dreamy":0.46,
		"angry":0.96,
		"romantic":0.84,
		"dancing":0.97,
		"christmas":0.92,
		"danceability":0.95
	},
	"0": {
		"happy":1,
		"humorous":0.9,
		"sad":0.5,
		"dreamy":0.5,
		"angry":1,
		"romantic":0.9,
		"dancing":1,
		"christmas":1,
		"danceability":1
	},
	"1": {
		"happy":0.96,
		"humorous":0.86,
		"sad":0.46,
		"dreamy":0.46,
		"angry":0.96,
		"romantic":0.84,
		"dancing":0.97,
		"christmas":0.92,
		"danceability":0.95
	},
	"2": {
		"happy":0.92,
		"humorous":0.82,
		"sad":0.42,
		"dreamy":0.42,
		"angry":0.92,
		"romantic":0.78,
		"dancing":0.93,
		"christmas":0.83,
		"danceability":0.9
	},
	"3": {
		"happy":0.88,
		"humorous":0.78,
		"sad":0.38,
		"dreamy":0.38,
		"angry":0.88,
		"romantic":0.73,
		"dancing":0.9,
		"christmas":0.75,
		"danceability":0.85
	},
	"4": {
		"happy":0.83,
		"humorous":0.73,
		"sad":0.33,
		"dreamy":0.33,
		"angry":0.83,
		"romantic":0.67,
		"dancing":0.87,
		"christmas":0.67,
		"danceability":0.8
	},
	"5": {
		"happy":0.79,
		"humorous":0.69,
		"sad":0.29,
		"dreamy":0.29,
		"angry":0.79,
		"romantic":0.61,
		"dancing":0.83,
		"christmas":0.58,
		"danceability":0.75
	},
	"6": {
		"happy":0.75,
		"humorous":0.65,
		"sad":0.25,
		"dreamy":0.25,
		"angry":0.75,
		"romantic":0.55,
		"dancing":0.8,
		"christmas":0.5,
		"danceability":0.7
	},
	"7": {
		"happy":0.71,
		"humorous":0.61,
		"sad":0.21,
		"dreamy":0.21,
		"angry":0.71,
		"romantic":0.49,
		"dancing":0.77,
		"christmas":0.42,
		"danceability":0.65
	},
	"8": {
		"happy":0.67,
		"humorous":0.57,
		"sad":0.17,
		"dreamy":0.17,
		"angry":0.67,
		"romantic":0.43,
		"dancing":0.73,
		"christmas":0.33,
		"danceability":0.6
	},
	"9": {
		"happy":0.63,
		"humorous":0.53,
		"sad":0.13,
		"dreamy":0.13,
		"angry":0.63,
		"romantic":0.38,
		"dancing":0.7,
		"christmas":0.25,
		"danceability":0.55
	},
	"10": {
		"happy":0.58,
		"humorous":0.48,
		"sad":0.08,
		"dreamy":0.08,
		"angry":0.58,
		"romantic":0.32,
		"dancing":0.67,
		"christmas":0.17,
		"danceability":0.5
	},
	"11": {
		"happy":0.54,
		"humorous":0.44,
		"sad":0.04,
		"dreamy":0.04,
		"angry":0.54,
		"romantic":0.26,
		"dancing":0.63,
		"christmas":0.08,
		"danceability":0.45
	},
	"12": {
		"happy":0.5,
		"humorous":0.4,
		"sad":0,
		"dreamy":0,
		"angry":0.5,
		"romantic":0.2,
		"dancing":0.6,
		"christmas":0,
		"danceability":0.4
	}
}
};

var tempoSched = 
{"weekday":  
{
	"3": {
		"happy":79,
		"humorous":78,
		"sad":58,
		"dreamy":78,
		"angry":88,
		"romantic":63,
		"dancing":97,
		"christmas":53
	},
	"4": {
		"happy":88,
		"humorous":87,
		"sad":65,
		"dreamy":85,
		"angry":96,
		"romantic":75,
		"dancing":104,
		"christmas":67
	},
	"5": {
		"happy":96,
		"humorous":95,
		"sad":73,
		"dreamy":93,
		"angry":104,
		"romantic":88,
		"dancing":111,
		"christmas":80
	},
	"6": {
		"happy":105,
		"humorous":103,
		"sad":80,
		"dreamy":100,
		"angry":112,
		"romantic":100,
		"dancing":118,
		"christmas":93
	},
	"7": {
		"happy":114,
		"humorous":112,
		"sad":88,
		"dreamy":108,
		"angry":120,
		"romantic":113,
		"dancing":125,
		"christmas":107
	},
	"8": {
		"happy":123,
		"humorous":120,
		"sad":95,
		"dreamy":115,
		"angry":128,
		"romantic":125,
		"dancing":133,
		"christmas":120
	},
	"9": {
		"happy":131,
		"humorous":128,
		"sad":103,
		"dreamy":123,
		"angry":135,
		"romantic":138,
		"dancing":140,
		"christmas":133
	},
	"10": {
		"happy":140,
		"humorous":137,
		"sad":110,
		"dreamy":130,
		"angry":143,
		"romantic":150,
		"dancing":147,
		"christmas":147
	},
	"11": {
		"happy":149,
		"humorous":145,
		"sad":118,
		"dreamy":138,
		"angry":151,
		"romantic":163,
		"dancing":154,
		"christmas":160
	},
	"12": {
		"happy":158,
		"humorous":153,
		"sad":125,
		"dreamy":145,
		"angry":159,
		"romantic":175,
		"dancing":161,
		"christmas":173
	},
	"13": {
		"happy":166,
		"humorous":162,
		"sad":133,
		"dreamy":153,
		"angry":167,
		"romantic":188,
		"dancing":168,
		"christmas":187
	},
	"14": {
		"happy":175,
		"humorous":170,
		"sad":140,
		"dreamy":160,
		"angry":175,
		"romantic":200,
		"dancing":175,
		"christmas":200
	},
	"15": {
		"happy":166,
		"humorous":162,
		"sad":133,
		"dreamy":153,
		"angry":167,
		"romantic":188,
		"dancing":168,
		"christmas":187
	},
	"16": {
		"happy":158,
		"humorous":153,
		"sad":125,
		"dreamy":145,
		"angry":159,
		"romantic":175,
		"dancing":161,
		"christmas":173
	},
	"17": {
		"happy":149,
		"humorous":145,
		"sad":118,
		"dreamy":138,
		"angry":151,
		"romantic":163,
		"dancing":154,
		"christmas":160
	},
	"18": {
		"happy":140,
		"humorous":137,
		"sad":110,
		"dreamy":130,
		"angry":143,
		"romantic":150,
		"dancing":147,
		"christmas":147
	},
	"19": {
		"happy":131,
		"humorous":128,
		"sad":103,
		"dreamy":123,
		"angry":135,
		"romantic":138,
		"dancing":140,
		"christmas":133
	},
	"20": {
		"happy":123,
		"humorous":120,
		"sad":95,
		"dreamy":115,
		"angry":128,
		"romantic":125,
		"dancing":133,
		"christmas":120
	},
	"21": {
		"happy":114,
		"humorous":112,
		"sad":88,
		"dreamy":108,
		"angry":120,
		"romantic":113,
		"dancing":125,
		"christmas":107
	},
	"22": {
		"happy":105,
		"humorous":103,
		"sad":80,
		"dreamy":100,
		"angry":112,
		"romantic":100,
		"dancing":118,
		"christmas":93
	},
	"23": {
		"happy":96,
		"humorous":95,
		"sad":73,
		"dreamy":93,
		"angry":104,
		"romantic":88,
		"dancing":111,
		"christmas":80
	},
	"0": {
		"happy":88,
		"humorous":87,
		"sad":65,
		"dreamy":85,
		"angry":96,
		"romantic":75,
		"dancing":104,
		"christmas":67
	},
	"1": {
		"happy":79,
		"humorous":78,
		"sad":58,
		"dreamy":78,
		"angry":88,
		"romantic":63,
		"dancing":97,
		"christmas":53
	},
	"2": {
		"happy":70,
		"humorous":70,
		"sad":50,
		"dreamy":70,
		"angry":80,
		"romantic":50,
		"dancing":90,
		"christmas":40
	}
}, 
"weekend": 
{
	"13": {
		"happy":67,
		"humorous":66,
		"sad":84,
		"dreamy":80,
		"angry":84,
		"romantic":53,
		"dancing":62,
		"christmas":53,
		"danceability":0.45
	},
	"14": {
		"happy":73,
		"humorous":73,
		"sad":88,
		"dreamy":84,
		"angry":88,
		"romantic":60,
		"dancing":68,
		"christmas":67,
		"danceability":0.5
	},
	"15": {
		"happy":80,
		"humorous":79,
		"sad":93,
		"dreamy":89,
		"angry":91,
		"romantic":68,
		"dancing":75,
		"christmas":80,
		"danceability":0.55
	},
	"16": {
		"happy":87,
		"humorous":85,
		"sad":97,
		"dreamy":93,
		"angry":95,
		"romantic":75,
		"dancing":82,
		"christmas":93,
		"danceability":0.6
	},
	"17": {
		"happy":93,
		"humorous":91,
		"sad":101,
		"dreamy":98,
		"angry":99,
		"romantic":83,
		"dancing":88,
		"christmas":107,
		"danceability":0.65
	},
	"18": {
		"happy":100,
		"humorous":98,
		"sad":105,
		"dreamy":103,
		"angry":103,
		"romantic":90,
		"dancing":95,
		"christmas":120,
		"danceability":0.7
	},
	"19": {
		"happy":107,
		"humorous":104,
		"sad":109,
		"dreamy":107,
		"angry":106,
		"romantic":98,
		"dancing":102,
		"christmas":133,
		"danceability":0.75
	},
	"20": {
		"happy":113,
		"humorous":110,
		"sad":113,
		"dreamy":112,
		"angry":110,
		"romantic":105,
		"dancing":108,
		"christmas":147,
		"danceability":0.8
	},
	"21": {
		"happy":120,
		"humorous":116,
		"sad":118,
		"dreamy":116,
		"angry":114,
		"romantic":113,
		"dancing":115,
		"christmas":160,
		"danceability":0.85
	},
	"22": {
		"happy":127,
		"humorous":123,
		"sad":122,
		"dreamy":121,
		"angry":118,
		"romantic":120,
		"dancing":122,
		"christmas":173,
		"danceability":0.9
	},
	"23": {
		"happy":133,
		"humorous":129,
		"sad":126,
		"dreamy":125,
		"angry":121,
		"romantic":128,
		"dancing":128,
		"christmas":187,
		"danceability":0.95
	},
	"0": {
		"happy":140,
		"humorous":135,
		"sad":130,
		"dreamy":130,
		"angry":125,
		"romantic":135,
		"dancing":135,
		"christmas":200,
		"danceability":1
	},
	"1": {
		"happy":133,
		"humorous":129,
		"sad":126,
		"dreamy":125,
		"angry":121,
		"romantic":128,
		"dancing":128,
		"christmas":187,
		"danceability":0.95
	},
	"2": {
		"happy":127,
		"humorous":123,
		"sad":122,
		"dreamy":121,
		"angry":118,
		"romantic":120,
		"dancing":122,
		"christmas":173,
		"danceability":0.9
	},
	"3": {
		"happy":120,
		"humorous":116,
		"sad":118,
		"dreamy":116,
		"angry":114,
		"romantic":113,
		"dancing":115,
		"christmas":160,
		"danceability":0.85
	},
	"4": {
		"happy":113,
		"humorous":110,
		"sad":113,
		"dreamy":112,
		"angry":110,
		"romantic":105,
		"dancing":108,
		"christmas":147,
		"danceability":0.8
	},
	"5": {
		"happy":107,
		"humorous":104,
		"sad":109,
		"dreamy":107,
		"angry":106,
		"romantic":98,
		"dancing":102,
		"christmas":133,
		"danceability":0.75
	},
	"6": {
		"happy":100,
		"humorous":98,
		"sad":105,
		"dreamy":103,
		"angry":103,
		"romantic":90,
		"dancing":95,
		"christmas":120,
		"danceability":0.7
	},
	"7": {
		"happy":93,
		"humorous":91,
		"sad":101,
		"dreamy":98,
		"angry":99,
		"romantic":83,
		"dancing":88,
		"christmas":107,
		"danceability":0.65
	},
	"8": {
		"happy":87,
		"humorous":85,
		"sad":97,
		"dreamy":93,
		"angry":95,
		"romantic":75,
		"dancing":82,
		"christmas":93,
		"danceability":0.6
	},
	"9": {
		"happy":80,
		"humorous":79,
		"sad":93,
		"dreamy":89,
		"angry":91,
		"romantic":68,
		"dancing":75,
		"christmas":80,
		"danceability":0.55
	},
	"10": {
		"happy":73,
		"humorous":73,
		"sad":88,
		"dreamy":84,
		"angry":88,
		"romantic":60,
		"dancing":68,
		"christmas":67,
		"danceability":0.5
	},
	"11": {
		"happy":67,
		"humorous":66,
		"sad":84,
		"dreamy":80,
		"angry":84,
		"romantic":53,
		"dancing":62,
		"christmas":53,
		"danceability":0.45
	},
	"12": {
		"happy":60,
		"humorous":60,
		"sad":80,
		"dreamy":75,
		"angry":80,
		"romantic":45,
		"dancing":55,
		"christmas":40,
		"danceability":0.4
	}
}
};