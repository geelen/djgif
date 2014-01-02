;
(function (app) {
  'use strict';

  app.factory('RdioPlayback', function () {

    var logger = function (msg) {
      return function () {
        console.log(msg, arguments)
      }
    }

    var RdioPlayback = {
      rdioSwf: undefined,
      ready: false,
      playing: false,
      playNewSource: function (source) {
        if (this.ready) {
          this.rdioSwf.rdio_play(source);
          this.playing = true;
        } else {
          this.toPlay = source;
        }
      },
      playPause: function () {
        if (this.playing) {
          this.rdioSwf.rdio_pause();
          this.playing = false;
        } else {
          this.rdioSwf.rdio_play();
          this.playing = true;
        }
      }
    }

    // The raw callback objects
    RdioPlayback.swfCallbacks = {
      ready: function (user) {
        RdioPlayback.ready = true;
        if (RdioPlayback.toPlay) RdioPlayback.playNewSource(RdioPlayback.toPlay);
      },
      playStateChanged: logger("playStateChanged"),
      playingTrackChanged: logger("playingTrackChanged"),
      playingSourceChanged: logger("playingSourceChanged"),
      positionChanged: logger("positionChanged"),
      queueChanged: logger("queueChanged")

    }

    return RdioPlayback;
  });

})(angular.module('djgif'));
