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
        $scope.bpm = $scope.originalBpm * 2;
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
      var beatNr = Math.floor(timeSinceStart / beatDuration);
      var beatFraction = (timeSinceStart % beatDuration) / beatDuration;
      GifSequence.showGifFraction(beatNr, beatDuration, beatFraction);
      beatIndicator.style.borderLeftWidth = 300 * (1 - beatFraction) + "px";
//      console.log(performance.now())
    };
    requestAnimationFrame(dddddddropTheGif)
  });

})(angular.module('djgif'));
