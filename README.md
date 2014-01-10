# DJGif

It's a party!

### Dependencies:

    npm install -g gulp live-server
    npm install

### Running

Fire off `gulp` in the main dir then `cd dist && live-server` in another tab

### Deploying

    aws s3 sync dist s3://djgif --exclude '.*' --exclude '**/.*' --cache-control "max-age=60"
