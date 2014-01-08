;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback, $location) {
    window.loc = $location;
    console.log($location.search());

    function randomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    $scope.fallbackImage = randomElement([
      {src: '4739995480_d5cb94805c_o.jpg', credit: 'http://www.flickr.com/photos/carlosrodrigueztorre/4739995480'}
    ]);

    $scope.player = RdioPlayback;
    $scope.rdioPlaylistId = "p1862229";
    $scope.tumblrNames = "dvdp,rekall";

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
