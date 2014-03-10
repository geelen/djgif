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
  var logs = [], putsed = false;
  Gif.prototype.smartFrameAt = function (beatNr, beatDuration, beatFraction) {
    var lengthInBeats = Math.max(1, Math.round(0.5 * 10 * this.length / beatDuration)),
      subBeat = beatNr % lengthInBeats,
      subFraction = (beatFraction / lengthInBeats) + subBeat / lengthInBeats;
//    if (logs.length < 100) logs.push([lengthInBeats, beatNr, beatDuration, this.length, beatFraction, lengthInBeats, subBeat, subFraction])
//    if (logs.length == 100 && !putsed) {
//      putsed = true;
//      console.table(logs);
//    }
    return this.frameAt(subFraction);
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
//        console.log("Downloaded and exploded " + url)
        GifSequence.gifs.push(new Gif(frames))
        if (!GifSequence.currentGif) {
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

    GifSequence.showGifFraction = function (beatNr, beatDuration, beatFraction) {
      if (GifSequence.currentGif) {
//        img.className = "frame-" + GifSequence.currentGif.frameAt(fraction);
        img.className = "frame-" + GifSequence.currentGif.smartFrameAt(beatNr, beatDuration, beatFraction);
//        console.log(img.className)
      }
    }

    return GifSequence;
  })

})(angular.module('djgif'));
