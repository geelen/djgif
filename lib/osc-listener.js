import Flux from './flux';
import Channels from './channels';

Channels.removeChannelsAfter = 10

socket = io.connect('http://127.0.0.1', {port: 8081, rememberTransport: false});

socket.on('connect', function () {
  console.log("SOCKET CONNECTED")
});

socket.on('message', function (obj) {
  //console.debug(obj)
  var [identifier, ...data] = obj
  if (identifier == "/sheeb/gif") {
    var [tumblr, priority] = data
    Flux.CHANNEL_UPDATE.trigger(tumblr, priority)
  } else if (identifier == "/sheeb/data") {
    var [barNr, beatNr, beatsPerBar, bpm] = data
    Flux.BEAT.trigger(barNr, 1 + beatNr % beatsPerBar, beatsPerBar, bpm)
  } else {
    console.log("UNKNOWN EVENT")
    console.log(obj)
  }
});
