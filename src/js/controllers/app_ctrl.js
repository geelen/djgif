;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback, Echonest, $stateParams, $q, Tumblr, GifSequence) {
    $scope.player = RdioPlayback;
    $scope.rdioPlaylistId = $stateParams.rdio;
    $scope.tumblrNames = $stateParams.tumblrs;

    // Load RDIO
    RdioPlayback.readyNewSource($scope.rdioPlaylistId);
    RdioPlayback.ready.then(function () {
      $scope.rdioReady = true;
    });

    // When we have a playlist, load Echonest
    RdioPlayback.$watch('playlist', function (tracks) {
      if (angular.isArray(tracks) && tracks.length > 0) {
        console.log("WE HAVE A PLAYLIST, FETCH THE METADATA")
        Echonest.getPlaylistData(tracks)
      }
    });
    Echonest.ready.then(function () {
      $scope.echoNestReady = true;
    });

    // Load GIFs
    Tumblr.startTumblrs($scope.tumblrNames.split(','));
    GifSequence.ready.then(function () {
      $scope.tumblrReady = true;
      var changeGifs = function () {
        $timeout(changeGifs, 10000);
        GifSequence.nextGif();
      };
      $timeout(changeGifs, 10000);
    });

    $q.all([RdioPlayback.ready, Echonest.ready, Tumblr.ready]).then(function (v) {
      $scope.readyToPlay = true;
      console.log("WE GON PARTY");
      RdioPlayback.playPause();
    })
  });

})(angular.module('djgif'));
