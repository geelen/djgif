var express = require('express');
var app = express(express.logger());
var AWS = require('aws-sdk');
var elastictranscoder = new AWS.ElasticTranscoder({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

app.get('/', function (req, res) {

});

var port = process.env.PORT || 3000;
console.log("Listening on " + port);
app.listen(port);

