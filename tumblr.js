( function ( window ) {
  var Tumblr = {
    apiKey: 'PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt',
    hashTag: '',
    displayTime: 20000,
    refreshTime: 5000,
    offset: 0,
    posts: [],
    nameField: document.querySelector( 'input' ),
    countField: document.querySelector( '.count' ),
    sourceField: document.querySelector( '.source' ),
    imageHolder: document.querySelector( '#image-holder' ),

    url: function () {
      return 'http://api.tumblr.com/v2/blog/' + Tumblr.currentBlog.name + '.tumblr.com/posts?api_key=' + Tumblr.apiKey + '&offset=' + Tumblr.offset + '&callback=Tumblr.response';
    },

    init: function ( names ) {
      if ( !Array.isArray( names ) ) {
        names = [names];
      }

      Tumblr.blogs = Tumblr.initBlogs( names );
      Tumblr.currentBlog = Tumblr.blogs[names[0]];

      Tumblr.offset = Tumblr.storage.get().offset;
      Tumblr.posts = Tumblr.storage.get().posts;

      Tumblr.updateDisplay();
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

    initBlogs: function ( name ) {
      return name.reduce (
        function ( memo,  n ) {
          memo[n] = {
            name: n,
            offset: 0
          }
          return memo;
        }, {}
      );
    },

    updateDisplay: function () {
      Tumblr.nameField.value = Tumblr.currentBlog.name;
      if ( Tumblr.posts.length ) Tumblr.countField.innerHTML = Tumblr.posts.length;
      Tumblr.sourceField.href = 'http://' + Tumblr.currentBlog.name + '.tumblr.com';
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
        Tumblr.updateDisplay();

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

    storage: {
      get: function () {
        return JSON.parse( localStorage.getItem( Tumblr.currentBlog.name ) ) || { offset: 0, posts: [] };
      },

      set: function () {
        var store = JSON.parse( localStorage.getItem( Tumblr.currentBlog.name ) ) || { posts: [] };
        store.offset = Tumblr.offset;

        for ( var i = 0; i < Tumblr.posts.length; i++ ) { 
          var post = Tumblr.posts[i];

          if ( store.posts.indexOf( post ) < 0 ) {
            store.posts.push( post ); 
          }
        }

        localStorage.setItem( Tumblr.currentBlog.name, JSON.stringify( store ) );
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

  window.Tumblr = Tumblr;

  Tumblr.init(Util.getParameterByName( 't' ) || 'classics');

}( window ) );
