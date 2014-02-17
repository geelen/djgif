;(function (angular) {
  'use strict';

  var app = angular.module('djgif', ['templates', 'ui.router'])

  // Allow BLOB urls
  app.config(function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  });

  app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true);
  });

  app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('app', {
        url: '/?rdio&tumblrs',
        controllerProvider: function ($stateParams) {
          if ($stateParams.rdio && $stateParams.tumblrs) {
            return 'AppCtrl';
          } else {
            return 'ComingSoonCtrl'
          }
        },
        templateUrl: function ($stateParams) {
          if ($stateParams.rdio && $stateParams.tumblrs) {
            return 'app.html';
          } else {
            return 'holding.html';
          }
        }
      });
  })

  app.service('GifInterpolator', require('./services/gif_interpolator'));

})(angular);
