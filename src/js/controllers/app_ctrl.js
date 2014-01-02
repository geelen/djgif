;(function(app) {
  'use strict';

  app.controller('AppCtrl', function ($scope) {

    $scope.rdioKey = "p1862229";
    $scope.tumblrNames = "dvdp,rekall";

    $scope.startSet = function () {
      console.log($scope.rdioKey);
      console.log($scope.tumblrNames);
      $scope.isPlaying = true;
    }

  });

})(angular.module('djgif'));
