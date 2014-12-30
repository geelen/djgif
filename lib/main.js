socket = io.connect('http://127.0.0.1', {port: 8081, rememberTransport: false});
console.log('oi');

socket.on('connect', function () {
  console.log("CONNECTED")
});

socket.on('message', function (obj) {
  console.log(obj);
});

