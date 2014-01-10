;(function (app) {
  'use strict';

  app.factory('RdioPlayback', function ($rootScope, Timing, $q, GifSequence) {

    var logger = function (msg) {
      return function () {
        console.log(msg, arguments)
      }
    }

    var swfLoaded = $q.defer();
    var ready = $q.defer();

    var RP = $rootScope.$new(true);

    RP.ready = ready.promise;
    RP.rdioSwf = undefined;
    RP.playing = false;
    RP.playlist = [];
    RP.toPause = false;
    RP.currentTrackIndex = undefined;

    RP.readyNewSource = function (source) {
      swfLoaded.promise.then(function () {
        RP.rdioSwf.rdio_play(source);
        RP.toPause = true;
      });
    };
    RP.playPause = function () {
      if (this.playing) {
        this.rdioSwf.rdio_pause();
        this.playing = false;
        Timing.stopPlaying();
      } else {
        this.rdioSwf.rdio_play();
        this.playing = true;
        Timing.startPlaying();
      }
    };
    RP.nextTrack = function () {
      this.rdioSwf.rdio_next();
    }

    // The raw callback objects
    RP.swfCallbacks = {
      // Really a 'loaded' callback
      ready: function (user) {
        swfLoaded.resolve();
        $rootScope.$apply();
      },
      playStateChanged: function (playState) {
        // As soon as we start playing, pause.
        if (RP.toPause && playState == 1) {
          RP.rdioSwf.rdio_pause();
          RP.toPause = false;
          ready.resolve();
        }
      },
      positionChanged: function (position) {
        console.log("RDIO SAYS " + position)
        Timing.adjustStartTime(position);
      },
      playingSourceChanged: function (data) {
        console.log("source changed!")
        RP.playlist = data.tracks;
        $rootScope.$apply();
      },
      playingTrackChanged: function (track, index) {
        console.log("Playing track " + track.name);
        Timing.setCurrentTrack(track);
        RP.currentTrackIndex = index;
      },
      queueChanged: logger("queueChanged")

    }

    return RP;
  });

})(angular.module('djgif'));
