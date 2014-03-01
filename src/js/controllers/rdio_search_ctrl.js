;(function (app) {
  'use strict';

  app.controller('RdioSearchCtrl', function ($scope, $http) {
    var rdioApiProxyUrl = "http://localhost:5000";
    $scope.search = {};

    $scope.searchGo = function () {
      $scope.results = [];
      $http.get(rdioApiProxyUrl + "/search", {params: {term: $scope.search.term}})
        .then(function (response) {
          $scope.results = response.data.result.results;
        })
    }

    $scope.getPlaylists = function (user) {
      if (user.playlistsXhr) return;

      user.playlistsXhr = $http.get(rdioApiProxyUrl + "/playlists", {params: {user: user.key}})
        .then(function (response) {
          user.playlists = response.data.result;
        })
    }
  })

})(angular.module('djgif'));
