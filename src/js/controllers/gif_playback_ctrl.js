;(function (app) {
  'use strict';

  app.controller('GifPlaybackCtrl', function ($scope, GifSequence) {
//    GifSequence.addGif("http://i.imgur.com/Rhm49Ev.gif")

    GifSequence.$watch('currentGif', function (newVal) {
      console.log("WATCHING " + newVal)
      if (newVal) $scope.frames = newVal.frames;
    })
  });

})(angular.module('djgif'));
