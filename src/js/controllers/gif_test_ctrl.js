;(function (app) {
  'use strict';

  app.controller('GifTestCtrl', function ($scope, GifSequence, $stateParams) {
    $scope.bpm = 90;
    GifSequence.addGif($stateParams.url);

    GifSequence.$watch('currentGif', function (newVal) {
      if (newVal) {
        $scope.frames = newVal.frames;
        $scope.originalGif = $stateParams.url;
        console.log(newVal)
        console.log(newVal.frameAt(0))
        console.log(newVal.frameAt(0.01))
        console.log(newVal.frameAt(0.5))
        console.log(newVal.frameAt(0.9))
        console.log(newVal.frameAt(0.99))
        console.log(newVal.frameAt(1.0))
      }
    });

    var dddddddropTheGif = function () {
      requestAnimationFrame(dddddddropTheGif);

      var beatDuration = 60 * 1000 / $scope.bpm;
      var beatFraction = (performance.now() % beatDuration) / beatDuration;
      GifSequence.showGifFraction(beatFraction);

//      console.log(performance.now())
    };
    requestAnimationFrame(dddddddropTheGif)
  });

})(angular.module('djgif'));
