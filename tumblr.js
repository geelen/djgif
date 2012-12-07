( function ( window ) {
  var Tumblr = {
    name: '',
    hashTag: '',
		displayTime: 20000,
		offset: 0, 
		posts: [],
		nameField: document.querySelector( 'input' ),
		countField: document.querySelector( '.count' ),
		sourceField: document.querySelector( '.source' ),

		url: function ( offset ) {
			return 'http://api.tumblr.com/v2/blog/' + Tumblr.name + '.tumblr.com/posts?api_key=PyezS3Q4Smivb24d9SzZGYSuhMNPQUhMsVetMC9ksuGPkK1BTt&offset=' + Tumblr.offset + '&callback=Tumblr.response';
		},
			
		init: function ( name ) {
			var storage;
			
      Tumblr.name = name;

			Tumblr.offset = Tumblr.storage.get().offset;
			Tumblr.posts = Tumblr.storage.get().posts;

			Tumblr.updateDisplay();
			Tumblr.request();
			Tumblr.changeImage();

			setInterval( Tumblr.changeImage, Tumblr.displayTime );
		},

		updateDisplay: function () {
			Tumblr.nameField.value = Tumblr.name;
			if ( Tumblr.posts.length ) Tumblr.countField.innerHTML = Tumblr.posts.length;
			Tumblr.sourceField.href = 'http://' + Tumblr.name + '.tumblr.com';
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

				setTimeout( function () {
					Tumblr.increaseOffset();
					Tumblr.request();	
				}, 5000 );
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
				var i = Math.floor( Tumblr.posts.length * Math.random() ),
						url = Tumblr.posts[i];

				document.querySelector( '#image-holder' ).style.backgroundImage = 'url(' + url + ')';	

				return url;
			}
		},

		storage: {
			get: function () {
				return JSON.parse( localStorage.getItem( Tumblr.name ) ) || { offset: 0, posts: [] };
			},

			set: function () {
				var store = JSON.parse( localStorage.getItem( Tumblr.name ) ) || { posts: [] };
				store.offset = Tumblr.offset;

				for ( var i = 0; i < Tumblr.posts.length; i++ ) { 
					var post = Tumblr.posts[i];

					if ( store.posts.indexOf( post ) < 0 ) {
						store.posts.push( post );	
					}
				}

				localStorage.setItem( Tumblr.name, JSON.stringify( store ) );
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