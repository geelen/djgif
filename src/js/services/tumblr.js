;(function(app) {
  'use strict';

  app.factory('Tumblr', function ($q) {
    var Tumblr = {},
      ready = $q.defer();

    Tumblr.startTumblrs = function (tumblrs) {

    };
    Tumblr.ready = ready.promise;

    return Tumblr;
  })

})(angular.module('djgif'));
