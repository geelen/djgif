;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback, Echonest, $stateParams) {
    $scope.player = RdioPlayback;
    $scope.rdioPlaylistId = $stateParams.rdio;
    $scope.tumblrNames = $stateParams.tumblrs;


    RdioPlayback.readyNewSource($scope.rdioPlaylistId);

    $scope.rdioReady = false;
    RdioPlayback.ready.then(function () {
      $scope.rdioReady = true;
    });
    RdioPlayback.$watch('playlist', function (tracks) {
      if (angular.isArray(tracks) && tracks.length > 0) {
        console.log(tracks)
        // Load the first data
        var firstData =  Echonest.getTrackData(tracks[0])
        // This is enough for EchoNest to be ready
        firstData.then(function () {
          $scope.echoNestReady = true;
        });
        // Chain up the next tracks in sequence
        var chainPromises = function (i) {
          firstData = firstData.then(function () {
            return Echonest.getTrackData(tracks[i]);
          });
        }
        for (var i = 1; i < tracks.length; i++) chainPromises(i)
      }
    })

    $scope.startSet = function () {
      $scope.isPlaying = true;
    }

    $scope.keyHandling = function (e) {
      if (e.charCode == 32) {
        RdioPlayback.playPause();
      } else if (e.charCode == 13) {
        RdioPlayback.nextTrack();
      } else {
        console.log(e)
      }
    }

  });

})(angular.module('djgif'));
