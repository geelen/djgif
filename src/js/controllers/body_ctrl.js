;(function(app) {
  'use strict';

  app.controller('BodyCtrl', function ($scope, RdioPlayback) {
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
