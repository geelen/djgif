( function ( window ) {
  var Tumblr = {
    apiKey: 'PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt',
    displayTime: 20000,
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
      Tumblr.currentBlog = Tumblr.blogs[names[0]];

      Tumblr.request();
      Tumblr.changeImage();
      Tumblr.initKeyboard();

      setInterval( Tumblr.changeImage, Tumblr.displayTime );
    },

    initKeyboard: function () {
      key( 'x', function () { 
        Tumblr.purgeCurrentImage();
        Tumblr.changeImage();
      } );
    },

    initBlogs: function ( names ) {
      return names.reduce (
        function ( memo,  name ) {
          var segments = name.split( '#' );
          var blog = Tumblr.storage.get( name );

          memo[name] = blog || {
            storageKey: name,
            name:       segments[0],
            tag:        segments[1] || '',
            offset:     0,
            posts:      []
          }

          return memo;
        }, {}
      );
    },

    request: function () {
      var element = document.createElement( 'script' );
      element.setAttribute( 'src', Tumblr.url( Tumblr.currentBlog ) );
      document.documentElement.appendChild( element );
    },

    response: function ( json ) {
      if ( json.response.posts.length > 0 ) {
        var gifs = Tumblr.getGifs( JSON.stringify( json ) );
        
        Tumblr.currentBlog.posts = Tumblr.currentBlog.posts.concat( gifs );
        Tumblr.storage.set( Tumblr.currentBlog );

        if ( Tumblr.postCountChangedCallback )
          Tumblr.postCountChangedCallback( Tumblr.currentBlog.posts.length );

        if ( !Tumblr.hasImage() ) Tumblr.changeImage();

        setTimeout( function () {
          Tumblr.increaseOffset();
          Tumblr.request();
        }, Tumblr.refreshTime );
      }
    },

    increaseOffset: function () {
      Tumblr.currentBlog.offset += 20;
    },

    getGifs: function ( blob ) {
      rGif = /http[^"]*?\.gif/g;

      return blob.match( rGif );
    },

    hasImage: function() {
      return Tumblr.imageHolder.style.backgroundImage;
    },

    changeImage: function () {
      if ( Tumblr.currentBlog.posts.length ) {
        var i = Math.floor( Tumblr.currentBlog.posts.length * Math.random() );
        
        Tumblr.currentImage = Tumblr.currentBlog.posts[i];
        Tumblr.imageHolder.style.backgroundImage = 'url(' + Tumblr.currentImage + ')'; 
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
  Tumblr.init(t);
  Tumblr.postCountChangedCallback = function ( count ) {
    document.querySelector( '.count' ).innerHTML = count;
  }

  // Update page elements

  document.querySelector( 'input' ).value = t;
  document.querySelector( '.source' ).href = 'http://' + Tumblr.name + '.tumblr.com';

}( window ) );
