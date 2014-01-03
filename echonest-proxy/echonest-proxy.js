var http = require('http'),
  request = require('request'),
  express = require('express'),
  app = express();

var apiKey = process.env.ECHONEST_API_KEY,
  searchUrl = "http://developer.echonest.com/api/v4/song/search?results=1&bucket=audio_summary&api_key=" + apiKey;

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

  if (req.query.artist && req.query.title) {
    console.log("Searching for " + req.query.artist + " - " + req.query.title)
    var url = searchUrl + "&artist=" + req.query.artist + "&title=" + req.query.title;
    request.get(url, function (err, data) {
      var body = JSON.parse(data.body);
      console.log("Found song " + body.response.songs[0].id + ". Fetching detailed analysis.")

      request.get(body.response.songs[0].audio_summary.analysis_url, function (err, data) {
        console.log("Received " + Buffer.byteLength(data.body) + " bytes");
        var analysis = JSON.parse(data.body);
        delete analysis.track.codestring;
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

app.options('/search', function (req, res) {
  setCors(req, res);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.send(200)
});

var port = process.env.PORT || 5001;
app.listen(port, function () {
  console.log("Listening on " + port);
});
