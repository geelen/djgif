;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback, Echonest, $stateParams, $q) {
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
        console.log("WE HAVE A PLAYLIST, FETCH THE METADATA")
        Echonest.getPlaylistData(tracks)
      }
    });
    Echonest.ready.then(function () {
      $scope.echoNestReady = true;
    });

    $q.all([RdioPlayback.ready, Echonest.ready]).then(function (v) {
      console.log("WE GON PARTY")
    })
  });

})(angular.module('djgif'));
