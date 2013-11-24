( function ( window ) {
  var $ = function ( selector, context ) {
    return ( context || document ).querySelector( selector );
  },

  Tumblr = {
    // toolmantim/gifcity Tumblr app
    apiKey: 'DjfvFbmCVQB3yHER0TMUB2ndguw5wqeNDv7ywyMipM9ZQpEtYn',
    changeImageDelay: 10000,
    requestDelay: 5000,
    offsetIncrement: 20,
    imageHolder: $( '#image-holder' ),
    requestCallbacks: {},

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
      Tumblr.refreshBlogs();
    },

    initKeyboard: function () {
      key( 'x', function () {
        Tumblr.purgeCurrentImage();
        Tumblr.changeImage();
      } );

      key( 'n', function () {
        Tumblr.changeImage();
      } );

      key( 'f', function() {
        Tumblr.toggleFullscreen();
      });
    },

    initBlogs: function ( names ) {
      return names.map ( function ( name ) {
        var blog = Tumblr.storage.get( name );
        var segments = name.split( '#' );

        return blog || {
          name:   segments[0],
          tag:    segments[1] || '',
          offset: 0,
          gifs:   []
        };
      } );
    },

    refreshBlogs: function () {
      async.forEach( Tumblr.blogs, Tumblr.request, function ( error ) {
        setTimeout( Tumblr.refreshBlogs, Tumblr.requestDelay );
      } );
    },

    request: function ( blog, callback ) {
      Tumblr.requestCallbacks[blog.name] = [];
      Tumblr.requestCallbacks[blog.name].push( callback );

      var element = document.createElement( 'script' );
      element.setAttribute( 'src', Tumblr.url( blog ) );

      Tumblr.requestCallbacks[blog.name].push( function () {
        element.parentNode.removeChild( element );
      });

      document.documentElement.appendChild( element );
    },

    response: function ( json ) {
      if (!json.response.blog) return;

      var blog = Tumblr.blogs.find( function ( blog ) {
        return ( blog.name == json.response.blog.name );
      } );

      Tumblr.handleResponse( blog, json );

      var callbacks = Tumblr.requestCallbacks[blog.name];

      callbacks.forEach( function ( callback ) {
        callback( null, blog );
      });
    },

    handleResponse: function ( blog, json ) {
      if ( json.response.posts.length > 0 ) {
        var gifs = Tumblr.getGifs( json.response.posts );

        if ( gifs.length > 0 ) {
          blog.gifs = blog.gifs.concat( gifs );

          if ( Tumblr.gifCountChangedCallback ) {
            Tumblr.gifCountChangedCallback( blog );
          }
        }

        blog.offset += Tumblr.offsetIncrement;
        Tumblr.storage.set( blog );

        if ( !Tumblr.current ) { Tumblr.changeImage(); }
      }
    },

    getGifs: function ( posts ) {
      return posts.reduce( function( photos, post ) {
        switch ( post.type ) {
          case "photo":
            return photos.concat( Tumblr.extractGifsFromPostPhotos( post.photos ) );
          case "text":
            return photos.concat( Tumblr.extractGifsFromHtml( post.body ) );
          default:
            return photos;
        }
      }, [] );
    },

    extractGifsFromPostPhotos: function ( photos ) {
      var photoUrls = photos.map( function( photo ) {
        return photo.original_size.url;
      } );
      return photoUrls.filter( function( url ) {
        return url.match( /\.gif$/ );
      } );
    },

    extractGifsFromHtml: function ( html ) {
      return html.match( /http[^"]*?\.gif/g );
    },

    changeImage: function () {
      clearTimeout ( Tumblr.changeImageTimeoutId );

      var pairs = Tumblr.blogs.reduce( function ( memo, blog ) {
        return memo.concat( blog.gifs.map( function ( gif ) {
          return {blog: blog, gif: gif};
        } ) );
      }, [] );

      // Hax for videos
      pairs = [
        {
          rate: 0.2,
          blog: 'test',
          gif: 'http://gifcity-transcode-output.s3.amazonaws.com/ron-paul.mp4?AWSAccessKeyId=AKIAI26QQBPUNTPBCO4A&Expires=1416810335&Signature=Bw06yBGiF792CQSqOnRYmBebW%2B4%3D'
        },
        {
          rate: 3.0,
          blog: 'test',
          gif: 'http://gifcity-transcode-output.s3.amazonaws.com/tumblr_lgb02mCfLm1qe0eclo1_r5_500.mp4?AWSAccessKeyId=AKIAI26QQBPUNTPBCO4A&Expires=1416810231&Signature=s9CuFP9BHQ28GU2GvPcvygp%2FmVM%3D'
        },
        {
          rate: 2.0,
          blog: 'test',
          gif: 'http://gifcity-transcode-output.s3-us-west-1.amazonaws.com/is-it-possible.mp4?AWSAccessKeyId=AKIAI26QQBPUNTPBCO4A&Expires=1416806882&Signature=duYo0d%2FJDK6xvCLxD49HPz9impU%3D'
//        },
//        {
//          blog: 'broken',
//          gif: 'http://gifcity-transcode-output.s3-us-west-1.amazonaws.com/NOOOPE.mp4'
        }
      ]

      Tumblr.current = pairs.rand();

      if ( Tumblr.current ) {
        var preload = new Image();

        preload.onload = preload.onerror = function (e) {
          Tumblr.imageHolder.innerHTML = "" +
            //"<img src='" + Tumblr.current.gif + "' class='left-image'>" +
            //"<img src='" + Tumblr.current.gif + "' class='image'>" +
            //"<img src='" + Tumblr.current.gif + "' class='right-image'>";
            "<video autoplay preload loop class='image'><source type='video/mp4' src='" + Tumblr.current.gif + "'></video>";
          Tumblr.changeImageTimeoutId = setTimeout( Tumblr.changeImage, Tumblr.changeImageDelay );
          Tumblr.imageHolder.getElementsByTagName('video')[0].playbackRate = Tumblr.current.rate;

          // Need a way to detect an actual error, not just loading a video as an image.
//          Tumblr.changeImageTimeoutId = setTimeout( Tumblr.changeImage, 0 );
        };

        preload.src = Tumblr.current.gif;
      }
    },

    toggleFullscreen: function() {
      if (document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullscreenElement ||
          document.msFullscreenElement) {
        if (document.cancelFullScreen) document.cancelFullScreen();
        if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
        if (document.msCancelFullScreen) document.msCancelFullScreen();
      } else {
        var requestFullscreen =
          Tumblr.imageHolder.requestFullScreen ||
          Tumblr.imageHolder.mozRequestFullScreen ||
          Tumblr.imageHolder.webkitRequestFullScreen ||
          Tumblr.imageHolder.msRequestFullScreen;
        if (!requestFullscreen)
          alert("Your browser doesn't support fullscreen");
        else
          requestFullscreen.call(Tumblr.imageHolder, Tumblr.imageHolder.ALLOW_KEYBOARD_INPUT);
      }
    },

    purgeCurrentImage: function () {
      if ( Tumblr.current ) {
        var gifs = Tumblr.current.blog.gifs.filter( function ( gif ) {
          return gif != Tumblr.current.gif;
        } );

        Tumblr.current.blog.gifs = gifs;
        Tumblr.storage.set( Tumblr.current.blog );
      }
    },

    storageKey: function ( blog ) {
      if ( blog.tag.length > 0 )
        return blog.name + "#" + blog.tag;
      else
        return blog.name;
    },

    listBlogs: function () {
      return Tumblr.blogs.map( function ( blog ) { return blog.name } );
    },

    addBlog: function ( name ) {
      var blogs = Tumblr.listBlogs();
      blogs.push( name );

      window.location.search = '?t=' + blogs;
    },

    removeBlog: function ( name ) {
      var blogs = Tumblr.listBlogs(),
          index = blogs.indexOf( name );
      blogs.splice( index, 1 );

      window.location.search = '?t=' + blogs;
    },

    storage: {
      get: function ( storageKey ) {
        var json = localStorage.getItem( storageKey );
        if ( json )
          return JSON.parse( json );
        else
          return null;
      },

      set: function ( blog ) {
        localStorage.setItem( Tumblr.storageKey( blog ), JSON.stringify( blog ) );
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

  Array.prototype.rand = function () {
    if ( this.length > 0 ) {
      var index = Math.floor( this.length * Math.random() );
      return this[index];
    }
  };

  Array.prototype.find = function ( predicate ) {
    return this.filter( predicate )[0];
  };

  var t = Util.getParameterByName( 't' ) || 'classics',
      viewingListEl = $( '.viewing-list' ),
      blogTemplate = $( '#blog[type="text/template"]' ).innerHTML;

  window.Tumblr = Tumblr;
  Tumblr.init( t.split( ',' ) );

  Tumblr.gifCountChangedCallback = function ( blog ) {
    $( '.blog[data-name="' + blog.name + '"] .count' ).innerHTML = blog.gifs.length;
  }

  $( 'form' ).addEventListener( 'submit', function ( event ) {
    var newBlog = newBlog = $( 'input', event.target ).value;
    Tumblr.addBlog( newBlog )
    event.preventDefault();
  });

  // Update page elements
  Tumblr.blogs.forEach( function ( blog ) {
    var view = blogTemplate.replace( /\{\{ name \}\}/g, blog.name ).
               replace( /\{\{ count \}\}/g, blog.gifs.length );

    viewingListEl.innerHTML += view;
  });

  // Remove buttons
  $( 'html' ).addEventListener( 'click', function ( event ) {
    if ( [].forEach.call( document.querySelectorAll( '.remove' ), function ( button ) {
      if ( button === event.target ) {
        var parent = button.parentNode;
        var blogName = parent.dataset.name;
        parent.parentNode.removeChild( parent );

        Tumblr.removeBlog( blogName );
      }
    } ) );
  } );

}( window ) );
