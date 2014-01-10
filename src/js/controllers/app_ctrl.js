;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback, $stateParams) {
    $scope.player = RdioPlayback;
    $scope.rdioPlaylistId = $stateParams.rdio;
    $scope.tumblrNames = $stateParams.tumblrs;


    RdioPlayback.readyNewSource($scope.rdioPlaylistId);

    $scope.rdioReady = false;
    RdioPlayback.ready.then(function () {
      $scope.rdioReady = true;
    });

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
