;(function(angular) {
  'use strict';

  var app = angular.module('djgif', [])

  // Allow BLOB urls
  app.config(function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  });

})(angular);
