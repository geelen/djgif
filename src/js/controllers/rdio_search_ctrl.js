;(function (app) {
  'use strict';

  app.controller('RdioSearchCtrl', function ($scope, $http) {
    $scope.search = {};

    $scope.searchGo = function () {
      $http.get("http://localhost:5000/search", {params: {term: $scope.search.term}})
        .then(function (response) {
          $scope.results = response.data.result.results;
        })
    }
  })

})(angular.module('djgif'));
