;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback, GifExploder, $timeout) {
    $scope.player = RdioPlayback;
    $scope.rdioPlaylistId = "p1862229";
    $scope.tumblrNames = "dvdp,rekall";

    GifExploder("http://i.imgur.com/JUsZEOn.gif").then(function (frames) {
      $scope.frames = frames;
      $scope.currentFrame = 1;
      function nextFrame() {
        $scope.currentFrame = ($scope.currentFrame + 1) % $scope.frames.length
        $timeout(nextFrame, 50)
      }
      $timeout(nextFrame, 50)
    });

    $scope.startSet = function () {
      $scope.isPlaying = true;
      RdioPlayback.playNewSource($scope.rdioPlaylistId);
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
