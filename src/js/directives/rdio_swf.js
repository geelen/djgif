;(function (app, callbacks) {
  'use strict';

  app.directive('rdioSwf', function ($interpolate, $document) {
    var template = "<object type=\"application/x-shockwave-flash\"\n        data=\"http://www.rdio.com/api/swf/\"\n        width=\"1\" height=\"1\"\n        class=\"rdio-swf\">\n  <param name=\"allowScriptAccess\" value=\"always\">\n  <param name=\"flashvars\" value=\"playbackToken={{ rdioKey }}&domain={{ domain }}&listener=angular.callbacks.{{ callbackId }}&enableLogging={{ logging }}\">\n</object>";
    return {
      scope: true,
      link: function (scope, element, attrs) {
        console.log("WE GOT A SWF");
        scope.rdioKey = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
        scope.domain = "localhost";
        scope.callbackId = '_' + (callbacks.counter++).toString(36);
        scope.logging = false;

        element[0].innerHTML = $interpolate(template)(scope);
        var rdio = element[0].children[0],
          playing = false;

        var logger = function (msg) {
          return function() { console.log(msg, arguments) }
        }

        callbacks[scope.callbackId] = {
          ready: function (user) {
            console.log("Playing!")
            rdio.rdio_play(scope.rdioPlaylistId)
            playing = true;
          },
          playStateChanged: logger("playStateChanged"),
          playingTrackChanged: logger("playingTrackChanged"),
          playingSourceChanged: logger("playingSourceChanged"),
          positionChanged: logger("positionChanged"),
          queueChanged: logger("queueChanged")

        }

        $document.bind('keypress', function(e) {
          if (e.charCode == 32) {
            if (playing) {
              rdio.rdio_pause();
              playing = false;
            } else {
              rdio.rdio_play();
              playing = true;
            }
          }
        })

      }
    }
  })

})(angular.module('djgif'), angular.callbacks);
