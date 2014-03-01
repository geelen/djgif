;(function (app) {
  'use strict';

  app.controller('GifTestCtrl', function ($scope, GifSequence, $stateParams) {
    GifSequence.addGif($stateParams.url)

    GifSequence.$watch('currentGif', function (newVal) {
      if (newVal) {
        $scope.frames = newVal.frames;
        console.log(newVal)
        console.log(newVal.frameAt(0))
        console.log(newVal.frameAt(0.01))
        console.log(newVal.frameAt(0.5))
        console.log(newVal.frameAt(0.9))
        console.log(newVal.frameAt(0.99))
        console.log(newVal.frameAt(1.0))
      }
    })
  });

})(angular.module('djgif'));
