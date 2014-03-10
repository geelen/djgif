;(function (app) {
  'use strict';

  app.controller('RdioSearchCtrl', function ($scope, $http, $state) {
    var rdioApiProxyUrl = "http://rdio-api-proxy.herokuapp.com";
    $scope.search = {};
    $scope.tumblrs = "dvdp,rekall";

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

    $scope.startPlayback = function (key) {
      $state.go('app', {rdio: key, tumblrs: $scope.tumblrs})
    }
  })

})(angular.module('djgif'));
