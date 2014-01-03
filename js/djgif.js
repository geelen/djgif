;(function(angular) {
  'use strict';

  angular.module('djgif', [])

})(angular);

;(function (app) {
  'use strict';

  app.controller('AppCtrl', function ($scope, RdioPlayback) {
    $scope.player = RdioPlayback;
    $scope.rdioPlaylistId = "p1862229";
    $scope.tumblrNames = "dvdp,rekall";

    $scope.startSet = function () {
      $scope.isPlaying = true;
      RdioPlayback.playNewSource($scope.rdioPlaylistId);
    }

    $scope.keyHandling = function (e) {
      if (e.charCode == 32) {
        RdioPlayback.playPause();
      } else if (e.charCode == 13) {
        RdioPlayback.nextTrack();
      } else {
        console.log(e)
      }
    }

  });

})(angular.module('djgif'));

;(function (app, callbacks) {
  'use strict';

  /*

    RdioSwf directive. This handles inserting the OBJECT tag into the DOM,
    which can't use normal Angular interpolations for some reason. So it
    loads into the template variable, runs $interpolate over it, and inserts
    it fully.

    Playback is handled by the RdioApi service.

   */

  app.directive('rdioSwf', function ($interpolate, RdioPlayback) {
    var template = "<object type=\"application/x-shockwave-flash\"\n        data=\"http://www.rdio.com/api/swf/\"\n        width=\"1\" height=\"1\"\n        class=\"rdio-swf\">\n  <param name=\"allowScriptAccess\" value=\"always\">\n  <param name=\"flashvars\" value=\"playbackToken={{ rdioKey }}&domain={{ domain }}&listener=angular.callbacks.{{ callbackId }}\">\n</object>";
    return {
      scope: true,
      link: function (scope, element, attrs) {
        scope.rdioKey = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
        scope.domain = "localhost";
        scope.callbackId = '_' + (callbacks.counter++).toString(36);

        element[0].innerHTML = $interpolate(template)(scope);
        RdioPlayback.rdioSwf = element[0].children[0];
        callbacks[scope.callbackId] = RdioPlayback.swfCallbacks;

      }
    }
  })

})(angular.module('djgif'), angular.callbacks);

;
(function (app) {
  'use strict';

  var searchUrl = "http://djgif-echonest-proxy.herokuapp.com/search"

  app.factory('Echonest', function ($http, Timing) {

    var Echonest = {
      getTrackData: function (track) {
        console.log("Getting track", track)
        return $http.get(searchUrl, {params: {
          artist: track.artist,
          title: track.name
        }}).then(function (response) {
            var song = response.data.response.songs[0]
            console.log(song)
            Timing.startTrack(track, song.analysis.beats)
          })
      }
    };

    return Echonest;

  })

})(angular.module('djgif'));

;(function (app) {
  'use strict';

  app.factory('RdioPlayback', function ($rootScope, Echonest, Timing) {

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
          Timing.stopPlaying();
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
      positionChanged: function (position) {
        console.log("RDIO SAYS " + position)
        Timing.adjustStartTime(position);
      },
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

;
(function (app) {
  'use strict';

  app.factory('Timing', function () {
    var beatVis = document.querySelectorAll('.beat-vis')[0];

    var Timing = {
      audioStartedAt: 0,
      beats: [],
      beatIndex: 0,
      playing: false
    }

    Timing.frame = function () {
      if (Timing.playing) requestAnimationFrame(Timing.frame);

      var positionSecs = performance.now() / 1000 - Timing.audioStartedAt;

      while (Timing.beatIndex < Timing.beats.length && positionSecs > Timing.beats[Timing.beatIndex].start) {
        Timing.beatIndex++;
      }
      var beat = Timing.beats[Timing.beatIndex - 1];

      var sinceLastBeat = positionSecs - beat.start,
        beatFraction = sinceLastBeat / beat.duration;

      console.log(positionSecs, beat.start, beat.duration, sinceLastBeat, beatFraction)

      beatVis.style.opacity = 1.0 - beatFraction
    }

    Timing.adjustStartTime = function(rdioTime) {
      var oldStartTime = Timing.audioStartedAt;
      Timing.audioStartedAt = performance.now() / 1000 - rdioTime;
      console.log("Synch out by " + (oldStartTime - Timing.audioStartedAt))
    };

    Timing.startTrack = function (track, beats) {
//      Timing.audioStartedAt = undefined;
      Timing.playing = true;
      Timing.beats = beats;
      Timing.beatIndex = 0;
      console.log(beats)
      requestAnimationFrame(Timing.frame);
    };

    Timing.stopPlaying = function () {
      Timing.playing = false;
    };

    return Timing;
  })

})(angular.module('djgif'));
