import Flux from './flux';
import jsonp from 'jsonp';

var apiKey = 'DjfvFbmCVQB3yHER0TMUB2ndguw5wqeNDv7ywyMipM9ZQpEtYn';

var fetchTumblrPage = function (blog, page, cb) {
  return jsonp('http://api.tumblr.com/v2' +
               '/blog/' + blog + '.tumblr.com/posts?' +
               'api_key=' + apiKey +
               '&offset=' + 20 * page +
               '&callback=JSON_CALLBACK', cb)
}

class Tumblr {
  
}

class Tumblrs {
  constructor() {
    console.log("TUMBLRS")
    this.tumblrs = {}
    Flux.NEW_TUMBLR.listen(this.add.bind(this))
  }

  add(tumblr) {
    if (!this.tumblrs[tumblr]) {
      this.tumblrs[tumblr] = new Tumblr(tumblr)
    }
  }
}

export default new Tumblrs();
