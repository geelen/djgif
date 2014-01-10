;(function (app) {
  'use strict';

  var searchUrl = "http://djgif-echonest-proxy.herokuapp.com/search"

  app.factory('Echonest', function ($http, $q) {

    var deferreds = {},
      ready = $q.defer();

    var Echonest = {
      ready: ready.promise,
      getTrackData: function (track) {
        console.log(track)
        console.log("Getting metadata for track " + track.key)
        if (!deferreds[track.key]) {
          deferreds[track.key] = $http.get(searchUrl, {params: {
            artist: track.artist,
            title: track.name
          }}).then(function (response) {
              return response.data.response.songs[0]
            });
        }
        return deferreds[track.key];
      },
      getPlaylistData: function (tracks) {
        // Load the first data
        var firstData = Echonest.getTrackData(tracks[0])
        // This is enough for EchoNest to be ready
        firstData.then(function () {
          ready.resolve();
        });
        // Chain up the next tracks in sequence
        var chainPromises = function (i) {
          firstData = firstData.then(function () {
            return Echonest.getTrackData(tracks[i]);
          });
        }
        for (var i = 1; i < tracks.length; i++) chainPromises(i)
      }

    };

    return Echonest;

  })

})(angular.module('djgif'));
