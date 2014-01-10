;
(function (app) {
  'use strict';

  app.factory('GifSequence', function (GifExploder, $rootScope, $q) {
    var ready = $q.defer();

    var GifSequence = $rootScope.$new()
    GifSequence.gifs = [];
    GifSequence.currentGif = undefined;
    GifSequence.ready = ready.promise;

    GifSequence.addGif = function (url) {
      GifExploder(url).then(function (frames) {
        console.log("Downloaded and exploded " + url)
        GifSequence.gifs.push({
          frames: frames,
          lengthSecs: frames.length * 0.1
        })
        if (!GifSequence.currentGif) {
          GifSequence.nextGif();
          ready.resolve();
          setInterval(GifSequence.nextGif, 10000);
        }
      });
    };

    GifSequence.nextGif = function () {
      console.log("Asking for next gif")
      GifSequence.currentGif = GifSequence.gifs.shift();
    };

    GifSequence.showGifFraction = function (fraction) {
      if (GifSequence.currentGif) {
        var currentFrame = Math.floor(GifSequence.currentGif.frames.length * fraction);
        img.className = "frame-" + currentFrame;
      }
    }

    return GifSequence;
  })

})(angular.module('djgif'));
