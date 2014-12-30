import Flux from './flux';

socket = io.connect('http://127.0.0.1', {port: 8081, rememberTransport: false});
console.log('oi');

socket.on('connect', function () {
  console.log("CONNECTED")
});

socket.on('message', function (obj) {
  var [identifier, ...data] = obj
  if (identifier == "/sheeb/gif") {
    var [tumblr, priority] = data
    Flux.CHANNEL_UPDATE.trigger(tumblr, priority)
  } else if (identifier == "/sheeb/data") {
    console.log("BEAT YO")
  } else {
    console.log("UNKNOWN EVENT")
    console.log(obj)
  }
});
