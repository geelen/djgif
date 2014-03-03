;(function (app) {
  'use strict';

  app.controller('GifTestCtrl', function ($scope, GifSequence, $stateParams) {
    $scope.bpm = 90;
    GifSequence.addGif($stateParams.url);

    GifSequence.$watch('currentGif', function (newVal) {
      if (newVal) {
        $scope.frames = newVal.frames;
        $scope.originalGif = $stateParams.url;
        $scope.originalBpm = 60 * 100 / newVal.length;
        $scope.bpm = $scope.originalBpm;
        console.log(newVal)
        console.log(newVal.frameAt(0))
        console.log(newVal.frameAt(0.01))
        console.log(newVal.frameAt(0.5))
        console.log(newVal.frameAt(0.9))
        console.log(newVal.frameAt(0.99))
        console.log(newVal.frameAt(1.0))
      }
    });

    var originalGifStarted;
    document.getElementById('original-gif').onload = function () {
      originalGifStarted = performance.now()
    }

    var beatNr = 0, beatIndicator = document.getElementById('beat-indicator');
    window.bi = beatIndicator;
    var dddddddropTheGif = function () {
      requestAnimationFrame(dddddddropTheGif);

      var beatDuration = 60 * 1000 / $scope.bpm;
      var timeSinceStart = (originalGifStarted) ? performance.now() - originalGifStarted : performance.now();
      var beatFraction = (timeSinceStart % beatDuration) / beatDuration;
      GifSequence.showGifFraction(Math.floor(timeSinceStart / beatDuration), beatDuration, beatFraction);
      beatIndicator.style.borderLeftWidth = 300 * (1 - beatFraction) + "px";
//      console.log(performance.now())
    };
    requestAnimationFrame(dddddddropTheGif)
  });

})(angular.module('djgif'));
