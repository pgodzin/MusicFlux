function display_view(query){
}

var TESTING_MODE = true;
// When the page is ready to go

$(document).ready(function(){
  // Display on both ends
  trigger_display_right();
  // Make sure that you see the tooltip over emojis
  $('[data-toggle="tooltip"]').tooltip(); 
});

function trigger_display_right(){
  if(localStorage['playlistStorage'] != undefined ){
    display_no_playlist();
  }
  else {
    
  }
}

function display_no_playlist(){
  $(".no-playlist").show();
  $(".playlist-display").hide();
}

/***

  PLAYER BEHAVIOR 
  
***/
// Show or hide the play control
$(document).on("mouseenter", ".one-player", function(){
  $(this).css('box-shadow', '3px 3px 5px #888888');
  var player_control = $(this).children(".player-left").children(".control");
  if (!(player_control.is(":visible"))){
    player_control.show();
  }
});
$(document).on("mouseleave", ".one-player", function(){
  $(this).css('box-shadow', '1px 1px 3px #888888');
  var player_control = $(this).children(".player-left").children(".control");
  if (player_control.is(":visible")){
    player_control.hide();
  }
});

function pause(element){
  console.log(element);
  element.parent().siblings(".control-audio").trigger('pause');
  element.siblings(".control-play").show();
  element.siblings(".control-pause").addBack(".control-pause").hide();
}
function play(element){
// Cut everyone and play instead
  $("audio").each(function(){ this.pause(); });
  $(".control-play").show();
  $(".control-pause").hide();
  $(".control-back").hide();
  $(".control-forward").hide();
  $(".player-right").css("background-color", '#f4f4f4')
  
// Now the real thing
  element.parent().siblings(".control-audio").trigger('play');
  element.siblings(".control-pause").show();
  element.siblings(".control-back").show();
  element.siblings(".control-forward").show();
  element.siblings(".control-play").addBack(".control-play").hide();
  element.parent().parent().parent().siblings(".player-right").css("background-color", '#e8d7a8');

}

// Show or hide the play/pause/back/fwd button
$(document).on("click", ".control-pause", function(){
  pause($(this));
});
$(document).on("click", ".control-back", function(){
  var currentTime = $(this).parent().siblings(".control-audio").prop('currentTime');
  $(this).parent().siblings(".control-audio").prop('currentTime', 0);
  if (currentTime < 3.0){
    // Looking for previous tracks
    var prev_song_control = ($(this).parent().parent().parent().parent()
                             .prev(".one-player").last()
                             .children(".player-left").children(".control")
                             .children(".control-buttons").children(".control-play"));
    if (prev_song_control.length != 0){
        play(prev_song_control);
        pause($(this));
    }
    // If there are no previous songs, the song keeps playing.
  }
});
$(document).on("click", ".control-play", function(){  
  var Ith_of_current_song;
  var ID_of_clicked_song = $(this).parent().parent().parent().attr('data-toggle');
  var Ith_of_clicked_song
  for (i = 0; i < playlist_local_dict.songs.length; i++){
    if (playlist_local_dict.songs[i].id == playlist_local_dict.currently_playing_song){
      Ith_of_current_song = i;
    }
    if (playlist_local_dict.songs[i].id == ID_of_clicked_song){
      Ith_of_clicked_song = i;
    }
  }
  // If just the next song
  if (Ith_of_clicked_song == (Ith_of_current_song + 1)){
    skipToNext($(this)
               .parent().parent().parent().parent()
               .prevAll(".one-player").first()
               .children(".player-left").children(".control")
               .children(".control-buttons")
               .children(".control-forward"));
  }
  
  // If after the next song
  if (Ith_of_clicked_song == (Ith_of_current_song + 1)){
    
  }
  play($(this));
// Everyone white and us green instead
});
$(document).on("click", ".control-forward", function(){ skipToNext($(this)); });

function skipToNext(element){
  element.parent().parent().parent().siblings(".player-right").css("background-color", '#f4f4f4');
  element.parent().siblings(".control-audio").prop('currentTime', 0);
  pause(element);
  // Looking for next tracks
  var current_player = element.parent().parent().parent().parent();
  var future_player = current_player.nextAll(".one-player").first();
  var prev_song_control = (element.parent().parent().parent().parent()
                           .nextAll(".one-player").first()
                           .children(".player-left").children(".control")
                           .children(".control-buttons").children(".control-play"));
  // If this to skip between the current song and the next song
  if (current_player.hasClass("current-song") && future_player.hasClass("next-song")){
    var html_of_energy = current_player.next();
    html_of_energy.insertAfter(future_player);
    current_player.removeClass("current-song");
    current_player.addClass("prev-song");
    future_player.removeClass("next-song");
    future_player.addClass("current-song");
    currentSongID = future_player.children(".player-left").attr('data-toggle');
    playlist_local_dict.currently_playing_song = currentSongID;
    future_player.children(".player-left").children(".control").children(".control-buttons").children(".control-forward").show();
        future_player.children(".player-left").children(".control").children(".control-buttons").children(".control-back").show();
  }
  play(prev_song_control);
  // If there are no previous songs, the song keeps playing.
};
function skipToNextSong(element){
  skipToNext(element.parent()
             .children(".control-buttons").children(".control-forward"));
}

$(document).on("ended", ".control-audio", function(){
  skipToNextSong(this);
});

/****

  TRIGGERING AJAX

****/


// Clicking on emoji
$(".emoji").click(function(){
  $(".alert-warning").show();
  $(".input-choice").val("");
  $(".seed-song-result").remove();
});

// Clicking on seed song
$(document).on('click', ".seed-song-result", function(){
  $(".input-choice").val($(this).children(".seed-right").children(".song-title").text().trim());
  $(".seed-song-result").remove();
  $(".alert-warning").show();
  localStorage['seed_song_id'] = $(this).attr('data-toggle');
  createPlaylistFromSeedSong($(this).attr('data-toggle'), false, []);
  // Make the seed songs disappear
});

// Show suggestions if the user types
$(".input-choice").on('input', function(){
  if ($(this).val() == ""){
    $(".seed-song-result").remove();
  }
  else {
    searchByTitle($(this).val());
  }
});
// Export a playlist
$(document).on('click', ".playlist-export > button", function(){
  console.log("triggered");
  createPlayWidget($(this).parent().parent()
                   .siblings(".playlist-image").children(".playlist-text-title")
                   .children("playlist-text-name").text());
});
// Delete a playlist
$(document).on("click", ".playlist-delete > button", function(){
  // Remove playlist
  $(this).parent().parent().parent().parent().html("");
  display_no_playlist();
  localStorage.clear();
});

/********

  RENDERING FUNCTIONS

*********/

var playlist_local_dict = {}

function display_playlist(playlist_dictionary){
  $(".alert-warning").hide();
  playlist_local_dict = playlist_dictionary;
  $(".playlist-display").show();
  console.log('h'); console.log(playlist_dictionary);
  $(".no-playlist").hide();
  $(".playlist-display").html("");
  console.log(playlist_dictionary.songs.length);
  if (playlist_dictionary.songs.length == 0){
    var no_playlist_result = ('<div class="no-playlist-result">'
                          + 'Oh no! :( There is no playlist' 
                          + ' corresponding to your search.</div>');
    $(".playlist-display").html(no_playlist_result);
  }
  else {
    console.log("inTheElse");
    // Beginning to append
    var allHTML = '<div class="playlist-container">';

    // Append the informations
    if (playlist_dictionary.mode == "emoji"){
      var img_url = get_url_emoji(playlist_dictionary.title)
    }
    else {
      var img_url = playlist_dictionary.img;
    }
    var playlist_info =  ('    <div class="playlist-title">'
                          + '      <div class="playlist-image">'
                          + '        <img src="'+img_url+'">'
                          + '      </div>'
                          + '      <div class="playlist-text-title">'
                          + '        <div class="playlist-timestamp">'
                          + '          Created on '+playlist_dictionary.timestamp+''
                          + '        </div>'
                          + '        <div class="playlist-text-name">'
                          + '          '+playlist_dictionary.title+''
                          + '        </div>'
                          + '      </div>'
                          + '    </div>');
    allHTML += playlist_info;
    
    var playlist_controls =  ('      <div class="playlist-controls">'
                            + '          <div class="playlist-delete">'
                            + '              <button type="button" class="btn btn-danger">Delete playlist</button>'
                            + '          </div>'
                            + '          <div class="playlist-export">'
                            + '              <button type="button" class="btn btn-success">Play on Spotify</button>'
                            + '          </div>'
                            + '        </div> <div class="playlist-songs">');
    allHTML += playlist_controls;

    var songs = playlist_dictionary.songs
    var i_of_song_playing = -1;
    // Append songs
    console.log("Here")
    for (var i = 0; i < songs.length; i++){
      var one_song = '          <div class="one-player';
      if (songs[i].id == playlist_dictionary.currently_playing_song){
        i_of_song_playing = i;
        one_song += ' current-song';
      }
      else {
        // Display little player
        if (i_of_song_playing == -1){
          // This means that we are in the prev songs area
          one_song += ' prev-song';
        }
        else {
          // This means that we are in the next songs area
          one_song += ' next-song';
        }
      }
      one_song += '">';
      one_song +=  ('<div class="player-left" data-toggle="'+songs[i].id+'">'
                  + '  <img src="'+songs[i].cover_url+'">'
                  + '  <div class="control" style="display:none;">'
                  + '    <div class="control-buttons">'
                  + '      <div class="control-back"'
                  + ((songs[i].id == playlist_dictionary.currently_playing_song) ? '' : 'style="display:none;"')
                  + '>'
                  + '        <span class="glyphicon glyphicon-step-backward"></span>'
                  + '      </div>'
                  + '      <div class="control-pause" style="display:none;">'
                  + '        <span class="glyphicon glyphicon-pause"></span>'
                  + '      </div>'
                  + '      <div class="control-play">'
                  + '        <span class="glyphicon glyphicon-play"></span>'
                  + '      </div>'
                  + '      <div class="control-forward"' 
                  + ((songs[i].id == playlist_dictionary.currently_playing_song) ? '' : 'style="display:none;"')
                  + '>'
                  + '        <span class="glyphicon glyphicon-step-forward"></span>'
                  + '      </div>'
                  + '    </div>'
                  + '    <audio src="'+songs[i].preview_url+'"'
                  + '      type="audio/mpeg" class="control-audio" onended="skipToNextSong($(this))">'
                  + '      <p>Your browser does not support the <code>audio</code> element.</p>'
                  + '    </audio>'
                  + '  </div>'
                  + '</div>');
      one_song +=  ('<div class="player-right">'
                  + '  <div class="player-title">'
                  + '    '+songs[i].title+' '
                  + '  </div>'
                  + '  <div class="player-artist">'
                  + '    '+songs[i].artist+' '
                  + '  </div>'
                  + '  <div class="player-album">'
                  + '    '+songs[i].album+' '
                  + '  </div>'
                  + '</div> </div>');
      // If this is the current song (again)
      if (songs[i].id == playlist_dictionary.currently_playing_song){
        one_song +=  ('<div class="slower-faster">'
                    + '    <div class="sf-left">'
                    + '  <img class="little-thunder" src="img/ef945c1810e8d003529117192819a506.png">'
                    + ' <div class="energy-flux">EnergyFlux</div>' 
                    + '    </div>'
                    + '    <div class="sf-middle">'
                    + ' Want more or less energy in your playlist? Try the toggle on the right!'
                    + '    </div>'
                    + '    <div class="sf-right">'
                    + '      The energy of the songs <br> '
                    + '      you play is currently: '
                    + '      <div class="btn-group" role="group" aria-label="...">'
                    + '        <button type="button" '
                    + '                class="btn btn-default btn-faster'
                    + ((direction === "asc") ? ' active': '' )
                    + '">          increasing'
                    + '        </button>'
                    + '        <button type="button" '
                    + '                class="btn btn-default btn-slower'
                    + ((direction === "desc") ? ' active': '' )
                    + '">          decreasing'
                    + '        </button>'
                    + '      </div>'
                    + '    </div>'
                    + '  </div>');
      }
    allHTML += (one_song);
    }
    console.log(allHTML);
    // Finishing to append
    $(".playlist-display").append(allHTML + '</div></div>');
    console.log($(".playlist-display").html());
    console.log($(".playlist-display").is(':visible'));
  }
}

function display_seed_suggestions(seed_results){
  $(".seed-song-result").remove();
  if (seed_results.length == 0){
    var no_seed_result = ('<div class="no-seed-result">'
                          + 'Oh no!' 
                          + ' <img src="img/117486950f4b712ce2db627add3853df.png" width="20px"> '
                          + 'There is no song' 
                          + ' corresponding to your search.</div>');
    $(".seed-song-result-container").html(no_seed_result);
  }
  else {
  $(".no-seed-result").remove();
    console.log(seed_results);
    for (i = 0; i < seed_results.length; i++) {
      var seed_song_result = ('<div class="seed-song-result" data-toggle="'+seed_results[i].id+'">'
            + '   <div class="seed-right result-part">'
            + '     <div class="song-title">'
            + '       '+seed_results[i].name+''
            + '     </div>'
            + '     <div class="song-artist">'
            + '       '+seed_results[i].artist+''
            + '     </div>'
            + '    </div>'
            + '  </div>');
      $(".seed-song-result-container").append(seed_song_result);
    }
  }
}

$(document).on('click', ".btn-faster", function(){
  direction = "asc";
  $(".btn-slower").removeAttr('active');
  $(this).attr('active');
  energySwitchActuated(playlist_local_dict);
});
$(document).on('click', ".btn-slower", function(){
  direction = "desc";
  $(".btn-faster").removeAttr('active');
  $(this).attr('active');
  energySwitchActuated(playlist_local_dict);
});

function display_spotify_widget(html_iframe){
  $('<div class="spotify_iframe"></div>').insertAfter(".playlist-controls");
  $(".spotify_iframe").html(html_iframe);
  $(".spotify_iframe").css("height", "0px");
  $(".spotify_iframe").animate({height: '425px'}, 500, 'easeOutQuart');
  $(".playlist-export > button").text("Close").parent().removeClass("playlist-export").addClass("remove-spotify");
}

$(document).on('click', '.remove-spotify > button', function(){
  $(this).text("Play In Spotify").parent().removeClass('remove-spotify').addClass("playlist-export");
  $(".spotify_iframe").animate({height: '0px'}, 
                               {duration: 500, 
                                easing: 'easeOutQuart',
                                complete: function(){
                                $(this).remove();}});
});

// Going on with rest of playlist