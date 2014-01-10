;
(function (app) {
  'use strict';

  var searchUrl = "http://djgif-echonest-proxy.herokuapp.com/search"

  app.factory('Echonest', function ($http, Timing) {

    var deferreds = {};

    var Echonest = {
      getTrackData: function (track) {
        console.log(track)
        console.log("Getting metadata for track " + track.key)
        if (!deferreds[track.key]) {
          deferreds[track.key] = $http.get(searchUrl, {params: {
            artist: track.artist,
            title: track.name
          }}).then(function (response) {
              var song = response.data.response.songs[0]
              console.log(song)
              Timing.startTrack(track, song.analysis.beats)
            })
        }
        return deferreds[track.key];
      }
    };

    return Echonest;

  })

})(angular.module('djgif'));
