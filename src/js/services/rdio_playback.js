;(function (app) {
  'use strict';

  app.factory('RdioPlayback', function ($rootScope, Echonest) {

    var logger = function (msg) {
      return function () {
        console.log(msg, arguments)
      }
    }

    var RdioPlayback = {
      rdioSwf: undefined,
      ready: false,
      playing: false,
      playlist: [],
      currentTrackIndex: undefined,
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
      },
      nextTrack: function () {
        this.rdioSwf.rdio_next();
      }
    }

    // The raw callback objects
    RdioPlayback.swfCallbacks = {
      ready: function (user) {
        RdioPlayback.ready = true;
        if (RdioPlayback.toPlay) RdioPlayback.playNewSource(RdioPlayback.toPlay);
      },
      playStateChanged: logger("playStateChanged"),
      positionChanged: logger("positionChanged"),
      playingSourceChanged: function (data) {
        RdioPlayback.playlist = data.tracks;
        $rootScope.$apply();
      },
      playingTrackChanged: function (track, index) {
        console.log("WAT")
        RdioPlayback.currentTrackIndex = index;
        Echonest.getTrackData(track);
        $rootScope.$apply();
      },
      queueChanged: logger("queueChanged")

    }

    return RdioPlayback;
  });

})(angular.module('djgif'));
