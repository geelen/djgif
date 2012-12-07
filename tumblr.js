( function ( window ) {
  var Tumblr = {
    apiKey: 'PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt',
    name: '',
    tag: '',
    displayTime: 20000,
    refreshTime: 5000,
    offset: 0,
    posts: [],
    imageHolder: document.querySelector( '#image-holder' ),

    url: function ( offset ) {
      return 'http://api.tumblr.com/v2' +
             '/blog/' + Tumblr.name + '.tumblr.com/posts?' +
             'api_key=PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt' +
             '&offset=' + Tumblr.offset +
             (Tumblr.tag.length ? '&tag=' + Tumblr.tag : '') +
             '&callback=Tumblr.response';
    },

    init: function ( name ) {
      var storage;

      var nameSegments = name.split('#');
      Tumblr.name = nameSegments[0];
      Tumblr.tag = nameSegments[1] || '';

      Tumblr.offset = Tumblr.storage.get().offset;
      Tumblr.posts = Tumblr.storage.get().posts;

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

    storageKey: function() {
      if ( Tumblr.tag.length ) {
        return Tumblr.name + "#" + Tumblr.tag;
      } else {
        return Tumblr.name;
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

  // Update page elements

  document.querySelector( 'input' ).value = t;
  if ( Tumblr.posts.length ) document.querySelector( '.count' ).innerHTML = Tumblr.posts.length;
  document.querySelector( '.source' ).href = 'http://' + Tumblr.name + '.tumblr.com';


}( window ) );
