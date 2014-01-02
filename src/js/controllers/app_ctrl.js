;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback) {

    $scope.rdioPlaylistId = "p1862229";
    $scope.tumblrNames = "dvdp,rekall";

    $scope.startSet = function () {
      $scope.isPlaying = true;
      RdioPlayback.playNewSource($scope.rdioPlaylistId);
    }

    $scope.keyHandling = function (e) {
      if (e.charCode == 32) {
        RdioPlayback.playPause();
      }
    }

  });

})(angular.module('djgif'));
