import Flux from './flux';

socket = io.connect('http://127.0.0.1', {port: 8081, rememberTransport: false});

socket.on('connect', function () {
  console.log("SOCKET CONNECTED")
});

socket.on('message', function (obj) {
  var [identifier, ...data] = obj
  if (identifier == "/sheeb/gif") {
    var [tumblr, priority] = data
    Flux.CHANNEL_UPDATE.trigger(tumblr, priority)
  } else if (identifier == "/sheeb/data") {
    console.log("BEAT YO")
    console.log(data)
  } else {
    console.log("UNKNOWN EVENT")
    console.log(obj)
  }
});
