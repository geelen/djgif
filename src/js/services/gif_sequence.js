;
(function (app) {
  'use strict';

  app.factory('GifSequence', function (GifExploder, $rootScope, $q, $timeout) {
    var ready = $q.defer(), img;

    var GifSequence = $rootScope.$new()
    GifSequence.gifs = [];
    GifSequence.currentGif = undefined;
    GifSequence.ready = ready.promise;
    GifSequence.ready.then(function () {
      img = document.getElementById("image-holster");
    });

    GifSequence.addGif = function (url) {
      GifExploder(url).then(function (frames) {
//        console.log("Downloaded and exploded " + url)
        GifSequence.gifs.push({
          frames: frames,
          lengthSecs: frames.length * 0.1
        })
        if (!GifSequence.currentGif) {
          GifSequence.nextGif();
          ready.resolve();
        }
      });
    };

    GifSequence.nextGif = function () {
      $timeout(GifSequence.nextGif, 10000);
//      console.log("Asking for next gif");
      var nextGifIndex = Math.floor(Math.random() * GifSequence.gifs.length);
      GifSequence.currentGif = GifSequence.gifs.splice(nextGifIndex, 1)[0];
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
