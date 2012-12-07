( function ( window ) {
  var Tumblr = {
    apiKey: 'PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt',
    changeImageDelay: 10000,
    requestDelay: 5000,
    offsetIncrement: 20,
    imageHolder: document.querySelector( '#image-holder' ),
    postCountChangedCallback: undefined,

    url: function ( blog ) {
      return 'http://api.tumblr.com/v2' +
             '/blog/' + blog.name + '.tumblr.com/posts?' +
             'api_key=' + Tumblr.apiKey +
             '&offset=' + blog.offset +
             ( blog.tag.length ? '&tag=' + blog.tag : '' ) +
             '&callback=Tumblr.response';
    },

    init: function ( names ) {
      Tumblr.blogs = Tumblr.initBlogs( names );

      Tumblr.changeImage();
      Tumblr.initKeyboard();
      Tumblr.request();
    },

    initKeyboard: function () {
      key( 'x', function () { 
        Tumblr.purgeCurrentImage();
        Tumblr.changeImage();
      } );

      key( 'n', function () {
        Tumblr.changeImage();
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
          Tumblr.currentBlog.offset += Tumblr.offsetIncrement;
          Tumblr.storage.set( Tumblr.currentBlog );

          if ( Tumblr.postCountChangedCallback ) {
            var postCount = Tumblr.blogs.reduce( function ( memo, blog ) { return memo + blog.posts.length; }, 0 );
            Tumblr.postCountChangedCallback( postCount );
          }

          if ( !Tumblr.currentImage ) Tumblr.changeImage();
        }

        setTimeout( Tumblr.request, Tumblr.requestDelay );
      }
    },

    getGifs: function ( posts ) {
      var postsWithPhotos = posts.filter( function( post ) {
        return post.photos && post.photos.length;
      } );

      var photos = postsWithPhotos.reduce( function( memo, post ) {
        return memo.concat( post.photos );
      }, [] );

      var photoUrls = photos.map( function( photo ) {
        return photo.original_size.url;
      } );

      return photoUrls.filter( function( url ) {
        return url.match( /\.gif$/ );
      } );
    },

    changeImage: function () {
      clearTimeout ( Tumblr.changeImageTimeoutId );

      Tumblr.currentBlog = Tumblr.pickRandomBlog();
      Tumblr.currentImage = Tumblr.pickRandomImage();

      var preload = new Image();

      preload.onload = function () {
        Tumblr.imageHolder.style.backgroundImage = 'url(' + Tumblr.currentImage + ')';
        Tumblr.changeImageTimeoutId = setTimeout( Tumblr.changeImage, Tumblr.changeImageDelay );
      };

      preload.onerror = function () {
        Tumblr.changeImageTimeoutId = setTimeout( Tumblr.changeImage, 0 );
      };

      preload.src = Tumblr.currentImage;
    },

    pickRandomBlog: function () {
      if ( Tumblr.blogs.length > 0 ) {
        var i = Math.floor( Tumblr.blogs.length * Math.random() );
        return Tumblr.blogs[i];
      } else
        return null;
    },

    pickRandomImage: function () {
      if ( Tumblr.currentBlog.posts.length > 0 ) {
        var i = Math.floor( Tumblr.currentBlog.posts.length * Math.random() );
        return Tumblr.currentBlog.posts[i];
      } else
        return null;
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
