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
    var template = "<object type=\"application/x-shockwave-flash\"\n        data=\"http://www.rdio.com/api/swf/\"\n        width=\"1\" height=\"1\"\n        class=\"rdio-swf\">\n  <param name=\"allowScriptAccess\" value=\"always\">\n  <param name=\"flashvars\" value=\"playbackToken={{ rdioKey }}&domain={{ domain }}&listener=angular.callbacks.{{ callbackId }}&enableLogging=1\">\n</object>";
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
