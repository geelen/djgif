var express = require('express');
var app = express(express.logger());
var AWS = require('aws-sdk');
var elastictranscoder = new AWS.ElasticTranscoder({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

app.get('/', function (req, res) {
  var filename = req.query.filename,
    jobCallback = function (error, data) {
      if (error) throw error;

      console.log("Job " + data.Job.Id + " is " + data.Job.Status);

      if (data.Job.Status === "Complete" || data.Job.Status === "Error") {
        res.send(JSON.stringify({
          gifcityWatchURL: "http://gifcity-transcode-output.s3-us-west-1.amazonaws.com/" + data.Job.Output.Key,
          data: data
        }));
      } else {
        setTimeout(function() {
          elastictranscoder.readJob({ Id: data.Job.Id }, jobCallback);
        }, 500);
      }
    };

  console.log("Transcoding " + filename);
  elastictranscoder.createJob({
    PipelineId: process.env.PIPELINE_ID,
    Input: {
      Key: filename,
      FrameRate: 'auto',
      Resolution: 'auto',
      AspectRatio: 'auto',
      Interlaced: 'auto',
      Container: 'auto'
    },
    Output: {
      ThumbnailPattern: "",
      Key: filename.replace(/\.gif$/i, '') + ".mp4",
      PresetId: process.env.PRESET_ID, // specifies the output video format
      Rotate: 'auto'
    }
  }, jobCallback);
});

var port = process.env.PORT || 3000;
console.log("Listening on " + port);
app.listen(port);

