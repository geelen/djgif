;(function (app, callbacks) {
  'use strict';

  app.directive('rdioSwf', function ($interpolate) {
    var template = "<object type=\"application/x-shockwave-flash\"\n        data=\"http://www.rdio.com/api/swf/\"\n        width=\"1\" height=\"1\"\n        class=\"rdio-swf\">\n  <param name=\"allowScriptAccess\" value=\"always\">\n  <param name=\"flashvars\" value=\"playbackToken={{ rdioKey }}&domain={{ domain }}&listener=angular.callbacks.{{ callbackId }}&enableLogging=1\">\n</object>";
    return {
      scope: true,
      link: function (scope, element, attrs) {
        console.log("WE GOT A SWF");
        scope.rdioKey = "GAlNi78J_____zlyYWs5ZG02N2pkaHlhcWsyOWJtYjkyN2xvY2FsaG9zdEbwl7EHvbylWSWFWYMZwfc=";
        scope.domain = "localhost";
        scope.callbackId = '_' + (callbacks.counter++).toString(36);

        element[0].innerHTML = $interpolate(template)(scope);
        var rdio = element[0].children[0]

        callbacks[scope.callbackId] = {
          ready: function (user) {
            console.log("Playing!")
            rdio.rdio_play(scope.rdioPlaylistId)
          }
        }

      }
    }
  })

})(angular.module('djgif'), angular.callbacks);
