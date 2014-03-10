"use strict";


var express = require("express"),
  grace = require("grace"),
  http = require('http'),
  request = require('request'),
  port = process.env.PORT || 5001,
  apiKey = process.env.ECHONEST_API_KEY,
  searchUrl = "http://developer.echonest.com/api/v4/song/search?results=1&bucket=audio_summary&api_key=" + apiKey,
  app = grace.create();

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

app.on("error", function (error) {
  console.log("ERROR CAUGHT")
//  console.error(error);
});

app.on("start", function () {
  var ex = express();
  ex.disable("x-powered-by");

  //Request error handler, this should be the first middleware
  //Capture uncaught exceptions thrown during a request
  ex.use(app.errorHandler(function (error, req, res, preventDefault) {
    //With preventDefault the default error handler is not called
    //Here you'll typically send to the user a 500 error
    preventDefault();

    res.send(500, "Bad luck " + req.connection.remoteAddress +
      "!\n\nReason: " + error.message);
  }));

  ex.use(express.compress());

  ex.get('/search', function (req, res) {
    setCors(req, res);

    if (req.query.artist && req.query.title) {
      console.log("Searching for " + req.query.artist + " - " + req.query.title)
      var url = searchUrl + "&artist=" + req.query.artist + "&title=" + req.query.title;
      request.get(url, function (err, data) {
        if (err) return res.send(500, err);

        var body = JSON.parse(data.body);
        if (!body.response.songs[0]) return res.send(404, body);
        console.log("Found song " + body.response.songs[0].id + ". Fetching detailed analysis.")

        request.get(body.response.songs[0].audio_summary.analysis_url, function (err, data) {
          console.log("Received " + Buffer.byteLength(data.body) + " bytes");
          var analysis = JSON.parse(data.body);
          delete analysis.track.codestring;
          delete analysis.track.echoprintstring;
          delete analysis.track.synchstring;
          delete analysis.tatums;
          delete analysis.segments;

          body.response.songs[0].analysis = analysis;
          res.send(200, JSON.stringify(body));
        });
      });
    } else {
      res.send(400, "Provide both artist and title");
    }
  });

  ex.options('/search', function (req, res) {
    setCors(req, res);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.send(200)
  });

  ex.use(function (error, req, res, next) {
    app.redirectError(error, req, res);
  });

  ex.listen(port, function () {
    console.log("Listening on " + port);
  });
});

app.on("shutdown", function (cb) {
  console.log("shutting down");
  cb();
});

app.on("exit", function (code) {
  console.log("bye (" + code + ")");
});

app.timeout(1000, function () {
  //The shutdown event never hangs up so this code never executes
  console.error("timed out, forcing shutdown");
});

app.start();
