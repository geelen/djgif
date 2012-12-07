( function ( window ) {
  var Tumblr = {
    apiKey: 'PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt',
    displayTime: 20000,
    refreshTime: 5000,
    offset: 0,
    posts: [],
    imageHolder: document.querySelector( '#image-holder' ),
    postCountChangedCallback: undefined,

    url: function ( offset ) {
      return 'http://api.tumblr.com/v2' +
             '/blog/' + Tumblr.currentBlog.name + '.tumblr.com/posts?' +
             'api_key=PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt' +
             '&offset=' + Tumblr.offset +
             (Tumblr.currentBlog.tag.length ? '&tag=' + Tumblr.currentBlog.tag : '') +
             '&callback=Tumblr.response';
    },

    init: function ( names ) {
      if ( !Array.isArray( names ) ) {
        names = [names];
      }

      Tumblr.blogs       = Tumblr.initBlogs( names );
      Tumblr.currentBlog = Tumblr.blogs[names[0]];
      Tumblr.offset      = Tumblr.storage.get().offset;
      Tumblr.posts       = Tumblr.storage.get().posts;

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
        function ( memo,  n ) {
          var segments = n.split( '#' );

          memo[n] = {
            name: segments[0],
            tag: segments[1] || '',
            offset: 0
          }

          return memo;
        }, {}
      );
    },

    request: function () {
      var element = document.createElement( 'script' );
      element.setAttribute( 'src', Tumblr.url() );
      document.documentElement.appendChild( element );
    },

    response: function ( json ) {
      if ( json.response.posts.length > 0 ) {
        var gifs = Tumblr.getGifs( JSON.stringify( json ) );
        
        Tumblr.posts = Tumblr.posts.concat( gifs );

        Tumblr.storage.set();
        if ( Tumblr.postCountChangedCallback )
          Tumblr.postCountChangedCallback( Tumblr.posts.length );

        if ( !Tumblr.hasImage() ) Tumblr.changeImage();

        setTimeout( function () {
          Tumblr.increaseOffset();
          Tumblr.request();
        }, Tumblr.refreshTime );
      }
    },

    increaseOffset: function () {
      Tumblr.offset = ( Tumblr.offset + 20 );
    },

    getGifs: function ( blob ) {
      rGif = /http[^"]*?\.gif/g;

      return blob.match( rGif );
    },

    hasImage: function() {
      return Tumblr.imageHolder.style.backgroundImage;
    },

    changeImage: function () {
      if ( Tumblr.posts.length ) {
        var i = Math.floor( Tumblr.posts.length * Math.random() );
        
        Tumblr.currentImage = Tumblr.posts[i];
        Tumblr.imageHolder.style.backgroundImage = 'url(' + Tumblr.currentImage + ')'; 
      }
    },

    purgeCurrentImage: function () {
      var imageIndex = Tumblr.posts.indexOf( Tumblr.currentImage );

      if ( imageIndex >= 0 ) {
        Tumblr.posts.splice( imageIndex, 1 );
        Tumblr.storage.set();
      }
    },

    storageKey: function() {
      if ( Tumblr.currentBlog.tag.length ) {
        return Tumblr.currentBlog.name + "#" + Tumblr.currentBlog.tag;
      } else {
        return Tumblr.currentBlog.name;
      }
    },

    storage: {
      get: function () {
        return JSON.parse( localStorage.getItem( Tumblr.storageKey() ) ) || { offset: 0, posts: [] };
      },

      set: function () {
        var store = JSON.parse( localStorage.getItem( Tumblr.storageKey() ) ) || { posts: [] };
        store.offset = Tumblr.offset;

        for ( var i = 0; i < Tumblr.posts.length; i++ ) { 
          var post = Tumblr.posts[i];

          if ( store.posts.indexOf( post ) < 0 ) {
            store.posts.push( post ); 
          }
        }

        localStorage.setItem( Tumblr.storageKey(), JSON.stringify( store ) );
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
