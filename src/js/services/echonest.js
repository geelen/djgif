;
(function (app) {
  'use strict';

  var apiKey = "E5VLSCRR8XY1QDWH4",
    searchUrl = "http://developer.echonest.com/api/v4/song/search"

  app.factory('Echonest', function ($http, Timing) {

    var Echonest = {
      getTrackData: function (track) {
        console.log("Getting track", track)
        return $http.get(searchUrl, {params: {
          api_key: apiKey,
          artist: track.artist,
          title: track.name,
          results: 1,
          bucket: 'audio_summary'
        }}).then(function (response) {
            var songData = response.data.response.songs[0]
            $http.get(songData.audio_summary.analysis_url)
            console.log(songData.audio_summary.analysis_url)
            Timing.setBPM(songData.audio_summary.tempo)

          })
      }
    };

    return Echonest;

  })

})(angular.module('djgif'));
