;(function (app) {
  'use strict';

  app.controller('ComingSoonCtrl', function ($scope) {
    function randomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    };

    $scope.fallbackImage = randomElement([
      {
        src: '4739995480_d5cb94805c_o.jpg',
        credit: 'http://www.flickr.com/photos/carlosrodrigueztorre/4739995480',
        position: '25% 25%'
      }
    ]);
  })

})(angular.module('djgif'));
