var osc = require('node-osc'),
    io = require('socket.io').listen(8081);

var oscServer, oscClient;

oscServer = new osc.Server(3333, '127.0.0.1');
console.log("Listening...");

io.sockets.on('connection', function (socket) {
  var messager = function (msg, rinfo) {
    console.log(msg, rinfo);
    socket.emit("message", msg);
  };

  oscServer.on('message', messager);

  socket.on('disconnect', function () {
    oscServer.removeListener("message", messager);
  })
});
