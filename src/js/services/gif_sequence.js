;
(function (app) {
  'use strict';

  app.factory('GifSequence', function (GifExploder, $rootScope) {

    var img = document.getElementById("image-holster")

    var GifSequence = $rootScope.$new()
    GifSequence.gifs = [];
    GifSequence.currentGif = undefined;

    GifSequence.addGif = function (url) {
      GifExploder(url).then(function (frames) {
        console.log("Got the gif!")
        console.log(frames)
        GifSequence.gifs.push({
          frames: frames,
          lengthSecs: frames.length * 0.1
        })
        if (!GifSequence.currentGif) GifSequence.nextGif();
      });
    };

    GifSequence.nextGif = function () {
      console.log("Asking for next gif")
      GifSequence.currentGif = GifSequence.gifs.shift();
    };

    GifSequence.showGifFraction = function (fraction) {
      if (GifSequence.currentGif) {
        var currentFrame = Math.floor(GifSequence.currentGif.frames.length * fraction);
        console.log("Playing frame " + currentFrame)
        img.className = "frame-" + currentFrame;
      }
    }

    return GifSequence;
  })

})(angular.module('djgif'));
