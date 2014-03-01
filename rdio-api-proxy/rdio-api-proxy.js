"use strict";

var http = require('http'),
  express = require('express'),
  Rdio = require("node-rdio"),
  rdio = new Rdio([process.env.RDIO_CONSUMER_KEY, process.env.RDIO_CONSUMER_SECRET]),
  app = express();

app.use(express.compress());

function setCors(req, res) {
  var origin = req.header('origin');

  if (origin && origin.match(/(localhost|\.dev|\.local|127\.0\.0\.1):\d+$/)) {
    origin = req.headers.origin;
  } else {
    origin = "http://djgif.com";
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
}

app.get('/search', function (req, res) {
  setCors(req, res);

  if (req.query.term) {
    var search = {
      query: req.query.term,
      types: 'album,user' //artist,label,playlist,track
    };

    rdio.call('search', search, function (err, data) {
      if (err) return res.send(500, { error: err });

      res.send(200, data);
    });
  } else {
    res.send(400, "Gimme a term to search for");
  }
});

app.options('/search', function (req, res) {
  setCors(req, res);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.send(200)
});

var port = process.env.PORT || 5001;
app.listen(port, function () {
  console.log("Listening on " + port);
});
