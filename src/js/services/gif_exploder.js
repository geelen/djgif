;
(function (app) {
  'use strict';

  app.factory('GifExploder', function ($q) {
    return function (url) {
      var deferred = $q.defer(),
        mirroredUrl = url.replace(/^.*\.media\.tumblr\.com/, '');

      var preload = new XMLHttpRequest();
      preload.open('GET', mirroredUrl, true);
      preload.responseType = 'arraybuffer';

      preload.onload = function () {
        var frames = [];

        var StreamReader = (function (arrayBuffer) {
          return {
            data: new Uint8Array(arrayBuffer),
            index: 0,
            readByte: function () {
              return this.data[this.index++];
            },
            peekByte: function () {
              return this.data[this.index];
            },
            skipBytes: function (n) {
              this.index += n;
            },
            peekBit: function (i) {
              return !!(this.peekByte() & (1 << 8 - i));
            },
            readAscii: function (n) {
              var s = '';
              for (var i = 0; i < n; i++) {
                s += String.fromCharCode(this.readByte());
              }
              return s;
            },
            isNext: function (array) {
              for (var i = 0; i < array.length; i++) {
                if (array[i] !== this.data[this.index + i]) return false;
              }
              return true;
            },
            log: function (str) {
//              console.log(this.index + ": " + str);
            },
            error: function (str) {
              console.error(this.index + ": " + str);
            }
          }
        })(this.response);

        StreamReader.log(StreamReader.readAscii(6));
        StreamReader.skipBytes(4); // Height & Width
        if (StreamReader.peekBit(1)) {
          StreamReader.log("GLOBAL COLOR TABLE")
          var colorTableSize = StreamReader.readByte() & 0x07;
          StreamReader.skipBytes(2);
          StreamReader.skipBytes(3 * Math.pow(2, colorTableSize + 1));
        } else {
          StreamReader.log("NO GLOBAL COLOR TABLE")
        }
        // WE HAVE ENOUGH FOR THE GIF HEADER!
        var gifHeader = this.response.slice(0, StreamReader.index);

        var spinning = true, expectingImage = false;
        while (spinning) {

          if (StreamReader.isNext([0x21, 0xFF])) {
            StreamReader.log("APPLICATION EXTENSION")
            StreamReader.skipBytes(2);
            var blockSize = StreamReader.readByte();
            StreamReader.log(StreamReader.readAscii(blockSize));

            if (StreamReader.isNext([0x03, 0x01])) {
              // we cool
              StreamReader.skipBytes(5)
            } else {
              StreamReader.log("A weird application extension. Skip until we have 2 NULL bytes");
              while (!(StreamReader.readByte() === 0 && StreamReader.peekByte() === 0));
              StreamReader.log("OK moving on")
              StreamReader.skipBytes(1);
            }
          } else if (StreamReader.isNext([0x21, 0xFE])) {
            StreamReader.log("COMMENT EXTENSION")
            StreamReader.skipBytes(2);

            while (!StreamReader.isNext([0x00])) {
              var blockSize = StreamReader.readByte();
              StreamReader.log(StreamReader.readAscii(blockSize));
            }
            StreamReader.skipBytes(1); //NULL terminator

          } else if (StreamReader.isNext([0x2c])) {
            StreamReader.log("IMAGE DESCRIPTOR!");
            if (!expectingImage) {
              // This is a bare image, not prefaced with a Graphics Control Extension
              // so we should treat it as a frame.
              frames.push({ index: StreamReader.index, delay: 0 });
            }
            expectingImage = false;

            StreamReader.skipBytes(9);
            if (StreamReader.peekBit(1)) {
              StreamReader.log("LOCAL COLOR TABLE");
              var colorTableSize = StreamReader.readByte() & 0x07;
              StreamReader.skipBytes(2);
              StreamReader.skipBytes(3 * Math.pow(2, colorTableSize + 1));
            } else {
              StreamReader.log("NO LOCAL TABLE PHEW");
              StreamReader.skipBytes(1);
            }

            StreamReader.log("MIN CODE SIZE " + StreamReader.readByte());
            StreamReader.log("DATA START");

            while (!StreamReader.isNext([0x00])) {
              var blockSize = StreamReader.readByte();
              StreamReader.log("SKIPPING " + blockSize + " BYTES");
              StreamReader.skipBytes(blockSize);
            }
            StreamReader.log("DATA END");
            StreamReader.skipBytes(1); //NULL terminator
          } else if (StreamReader.isNext([0x21, 0xF9, 0x04])) {
            StreamReader.log("GRAPHICS CONTROL EXTENSION!");
            // We _definitely_ have a frame. Now we're expecting an image
            var index = StreamReader.index;

            StreamReader.skipBytes(4);
            var delay = StreamReader.readByte() + StreamReader.readByte() * 256;
            frames.push({ index: index, delay: delay });
            StreamReader.log("FRAME DELAY " + delay);
            StreamReader.skipBytes(2);
            expectingImage = true;
          } else {
            spinning = false;
          }
        }
        var endOfFrames = StreamReader.index;
        console.log(frames)

        var gifFooter = this.response.slice(-1); //last bit is all we need
        for (var i = 0; i < frames.length; i++) {
          var frame = frames[i];
          var nextIndex = (i < frames.length - 1) ? frames[i+1].index : endOfFrames;
          frame.blob = new Blob([ gifHeader, this.response.slice(frame.index, nextIndex), gifFooter ], {type: 'image/gif'});
          frame.url = URL.createObjectURL(frame.blob);
        }
//        Tumblr.imageHolder.innerHTML = blobs.map(function (blob) {
//          return "<img src='" + URL.createObjectURL(blob) + "' class='image-slide'>"
//        }).join("\n") +
//          "<img src='" + URL.createObjectURL(new Blob([this.response], {type: 'image/gif'})) + "' class='image'>";
        deferred.resolve(frames);
      }

      console.log(mirroredUrl)
      preload.send();
      return deferred.promise;
    }
  });
})(angular.module('djgif'));
