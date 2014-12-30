import Flux from './flux';
import jsonp from 'jsonp';

var apiKey = 'DjfvFbmCVQB3yHER0TMUB2ndguw5wqeNDv7ywyMipM9ZQpEtYn',
  PER_PAGE = 20;

class Tumblr {
  constructor(name) {
    this.name = name
    this.gifs = []
    this.fetchPage(0)
  }

  fetchPage(page) {
    this.fetch(page, (err, res) => {
      if (err) throw err
      this.addGifs(res.response.posts)
      console.log(this.gifs.length)
      if ((page + 1) * PER_PAGE < res.response.total_posts) {
        this.fetchPage(page + 1)
      }
    })
  }

  fetch(page, cb) {
    jsonp('http://api.tumblr.com/v2' +
    '/blog/' + this.name + '.tumblr.com/posts?' +
    'api_key=' + apiKey +
    '&offset=' + PER_PAGE * page +
    '&callback=JSON_CALLBACK', cb)
  }

  addGifs(posts) {
    posts.forEach(post => {
      if (post.type == "photo") {
        this.addGifFromPhotos(post.photos)
      } else if (post.body) {
        this.addGifFromBody(post.body)
      }
    })
  }

  addGifFromPhotos(photos) {
    this.gifs = this.gifs.concat(
      photos.map(p => p.original_size.url)
        .filter(url => url.match(/.gif$/))
    )
  }

  addGifFromBody(body) {
    this.gifs = this.gifs.concat(
      body.match(/http[^"]*?\.gif/g)
    )
  }
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
