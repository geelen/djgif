;(function(app) {
  'use strict';

  app.factory('Tumblr', function ($q, $http, GifSequence) {
    var apiKey = 'DjfvFbmCVQB3yHER0TMUB2ndguw5wqeNDv7ywyMipM9ZQpEtYn',
      Tumblr = {},
      ready = $q.defer();

    var fetch = function (blog, page) {
      return $http.jsonp('http://api.tumblr.com/v2' +
                   '/blog/' + blog + '.tumblr.com/posts?' +
                   'api_key=' + apiKey +
                   '&offset=' + 20 * page +
                   '&callback=JSON_CALLBACK')
    }

    var extractGifsFromPostPhotos = function ( photos ) {
      var photoUrls = photos.map( function( photo ) {
        return photo.original_size.url;
      } );
      return photoUrls.filter( function( url ) {
        return url.match( /\.gif$/ );
      } );
    }

    var extractGifsFromHtml = function ( html ) {
      return html.match( /http[^"]*?\.gif/g );
    };

    var extractGif = function (post) {
      switch ( post.type ) {
        case "photo":
          angular.forEach(extractGifsFromPostPhotos( post.photos ), GifSequence.addGif);
          break;
        case "text":
          angular.forEach(extractGifsFromHtml( post.body ), GifSequence.addGif);
          break;
      }
    }

    Tumblr.startTumblrs = function (tumblrs) {
      angular.forEach(tumblrs, function (blog) {
        for (var i = 0; i < 1; i++) {
          fetch(blog, i).then(function (response) {
            ready.resolve();
            angular.forEach(response.data.response.posts, extractGif)
          });
        }
      })
    };
    Tumblr.ready = ready.promise;

    return Tumblr;
  })

})(angular.module('djgif'));
