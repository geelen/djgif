;
(function (app) {
  'use strict';

  app.factory('Timing', function () {
    var beatVis = document.querySelectorAll('.beat-vis')[0],
      convertBPMtoBeatLength = function (bpm) {
        return
      }

    var Timing = {
      audioStartedAt: 0,
      audioTime: 0,
      beatLengthMillis: 0,
      playing: false,
      setBPM: function(bpm) {
        this.beatLengthMillis = (60 / bpm) * 1000;
      }
    }

    Timing.frame = function () {
      if (Timing.playing) requestAnimationFrame(Timing.frame);

      var positionMillis = performance.now() - Timing.audioStartedAt,
        sinceLastBeat = positionMillis % Timing.beatLengthMillis,
        beatFraction = sinceLastBeat / Timing.beatLengthMillis;
      console.log(positionMillis, Timing.beatLengthMillis, sinceLastBeat, beatFraction)

      beatVis.style.opacity = 0.5 - beatFraction / 2
    }

    Timing.adjustStartTime = function(rdioTime) {
      Timing.audioStartedAt = performance.now() - rdioTime * 1000;
    };

    Timing.startPlaying = function (reset) {
      if (reset) Timing.audioStartedAt = performance.now();
      Timing.playing = true;
      requestAnimationFrame(Timing.frame);
    };

    Timing.stopPlaying = function () {
      Timing.playing = false;
    };

    return Timing;
  })

})(angular.module('djgif'));
