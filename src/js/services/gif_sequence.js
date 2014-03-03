;
(function (app) {
  'use strict';

  var Gif = function (frames) {
    this.frames = frames;

    this.length = 0;
    this.offsets = []
    angular.forEach(frames, angular.bind(this, function (frame) {
      this.offsets.push(this.length);
      this.length += frame.delay;
    }));
  }
  Gif.prototype.frameAt = function (fraction) {
    var offset = fraction * this.length;
//    console.log(offset)
    for (var i = 1, l = this.offsets.length; i < l; i++) {
      if (this.offsets[i] > offset) break;
    }
    return i - 1;
  }

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
        console.log("Downloaded and exploded " + url)
        GifSequence.gifs.push(new Gif(frames))
        if (!GifSequence.currentGif) {
          console.log("wut")
          GifSequence.nextGif();
          ready.resolve();
        }
      }, ready.reject);
    };

    GifSequence.nextGif = function () {
//      console.log("Asking for next gif");
      var nextGifIndex = Math.floor(Math.random() * GifSequence.gifs.length);
      GifSequence.currentGif = GifSequence.gifs.splice(nextGifIndex, 1)[0];
    };

    GifSequence.showGifFraction = function (fraction) {
      if (GifSequence.currentGif) {
        img.className = "frame-" + GifSequence.currentGif.frameAt(fraction);
//        console.log(img.className)
      }
    }

    return GifSequence;
  })

})(angular.module('djgif'));
