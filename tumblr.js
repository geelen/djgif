( function ( window ) {
  var Tumblr = {
    apiKey: 'PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt',
    displayTime: 10000,
    refreshTime: 5000,
    imageHolder: document.querySelector( '#image-holder' ),
    postCountChangedCallback: undefined,

    url: function ( blog ) {
      return 'http://api.tumblr.com/v2' +
             '/blog/' + blog.name + '.tumblr.com/posts?' +
             'api_key=' + Tumblr.apiKey +
             '&offset=' + blog.offset +
             (blog.tag.length ? '&tag=' + blog.tag : '') +
             '&callback=Tumblr.response';
    },

    init: function ( names ) {
      if ( !Array.isArray( names ) ) { names = [names]; }

      Tumblr.blogs = Tumblr.initBlogs( names );

      Tumblr.initKeyboard();
      Tumblr.changeBlog();
      Tumblr.changeImage();
      Tumblr.request();

      setInterval( Tumblr.refresh, Tumblr.displayTime );
    },

    initKeyboard: function () {
      key( 'x', function () { 
        Tumblr.purgeCurrentImage();
        Tumblr.refresh();
      } );
    },

    initBlogs: function ( names ) {
      return names.map (
        function ( name ) {
          var segments = name.split( '#' );
          var blog = Tumblr.storage.get( name );

          return blog || {
            storageKey: name,
            name:       segments[0],
            tag:        segments[1] || '',
            offset:     0,
            posts:      []
          }
        }
      );
    },

    request: function () {
      var element = document.createElement( 'script' );
      var url = Tumblr.url( Tumblr.currentBlog );

      element.setAttribute( 'src', url );
      document.documentElement.appendChild( element );
    },

    response: function ( json ) {
      if ( json.response.posts.length > 0 ) {
        var gifs = Tumblr.getGifs( json.response.posts );

        if ( gifs ) {

          Tumblr.currentBlog.posts = Tumblr.currentBlog.posts.concat( gifs );
          Tumblr.storage.set( Tumblr.currentBlog );

          if ( Tumblr.postCountChangedCallback ) {
            var postCount = Tumblr.blogs.reduce( function (memo, blog) { return memo + blog.posts.length; }, 0 );
            Tumblr.postCountChangedCallback( postCount );
          }

          if ( !Tumblr.hasImage() ) Tumblr.changeImage();
        }

        setTimeout( Tumblr.refresh, Tumblr.refreshTime );
      }
    },

    increaseOffset: function () {
      Tumblr.currentBlog.offset += 20;
    },

    getGifs: function ( posts ) {
      var photos = posts.reduce( function(memo, post) {
        return memo.concat(post.photos);
      }, [] );

      var photoUrls = photos.map( function(photo) {
        return photo.original_size.url;
      } );

      return photoUrls.filter( function(url) {
        return url.match(/\.gif$/);
      } );
    },

    hasImage: function() {
      return Tumblr.imageHolder.style.backgroundImage;
    },

    refresh: function () {
      Tumblr.increaseOffset();
      Tumblr.changeBlog();
      Tumblr.changeImage()
      Tumblr.request();
    },

    changeBlog: function () {
      if ( Tumblr.blogs.length ) {
        var i = Math.floor( Tumblr.blogs.length * Math.random() );
        Tumblr.currentBlog = Tumblr.blogs[i];
      }
    },

    changeImage: function () {
      if ( Tumblr.currentBlog.posts.length ) {
        var i = Math.floor( Tumblr.currentBlog.posts.length * Math.random() );
        
        Tumblr.currentImage = Tumblr.currentBlog.posts[i];

        var preload = new Image();
        
        preload.onload = function () {
          Tumblr.imageHolder.style.backgroundImage = 'url(' + Tumblr.currentImage + ')'; 
        };

        preload.src = Tumblr.currentImage;
      }
    },

    purgeCurrentImage: function () {
      var imageIndex = Tumblr.currentBlog.posts.indexOf( Tumblr.currentImage );

      if ( imageIndex >= 0 ) {
        Tumblr.currentBlog.posts.splice( imageIndex, 1 );
        Tumblr.storage.set( Tumblr.currentBlog );
      }
    },

    storage: {
      get: function ( storageKey ) {
        var blog = localStorage.getItem( storageKey );
        if (blog)
          return JSON.parse( blog );
        else
          return null;
      },
      set: function ( blog ) {
        localStorage.setItem( blog.storageKey, JSON.stringify( blog ) );
      }
    }
  },

  // General utils
  Util = {
    // Thanks http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
    getParameterByName: function ( name ) {
      var match = RegExp( '[?&]' + name + '=([^&]*)' ).exec( window.location.search );
      return match && decodeURIComponent( match[1] );
    }
  };

  var t = Util.getParameterByName( 't' ) || 'classics';

  window.Tumblr = Tumblr;
  Tumblr.init( t.split( ',' ) );
  Tumblr.postCountChangedCallback = function ( count ) {
    document.querySelector( '.count' ).innerHTML = count;
  }

  // Update page elements

  document.querySelector( 'input' ).value = t;
  document.querySelector( '.source' ).href = 'http://' + Tumblr.name + '.tumblr.com';

}( window ) );
