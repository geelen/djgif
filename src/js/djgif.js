;(function(angular) {
  'use strict';

  var app = angular.module('djgif', [])

  // Allow BLOB urls
  app.config(function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  });

  app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
  });

  app.config(function ($routeProvider) {
    $routeProvider.when('/', {controller: 'AppCtrl'})
      .otherwise({redirectTo: '/'})
  })

})(angular);
