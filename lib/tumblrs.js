import Flux from './flux';
import jsonp from 'jsonp';
import F from 'fkit';

var apiKey = 'DjfvFbmCVQB3yHER0TMUB2ndguw5wqeNDv7ywyMipM9ZQpEtYn',
  PER_PAGE = 20;

class Tumblr {
  constructor(name) {
    this.name = name
    this.gifs = []
    this.queuedGifs = []
    this.fetchPage(0)
  }

  fetchPage(page) {
    this.fetch(page, (err, res) => {
      if (err) throw err
      this.addGifs(res.response.posts)
      console.log(`${this.name} - ${this.gifs.length} GIFs total`)
      if ((page + 1) * PER_PAGE < res.response.total_posts) {
        setTimeout(() => {
          this.fetchPage(page + 1)
        }, 1000)
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
    if (!posts) return;
    var newGifs = posts.map(post => {
      if (post.type == "photo") {
        return this.extractGifsFromPhotos(post.photos)
      } else if (post.body) {
        return this.extractGifsFromBody(post.body)
      } else {
        return [];
      }
    })
    newGifs.forEach(g => this.gifs = this.gifs.concat(g))
    Flux.GIFS_AVAILABLE.trigger()
  }

  extractGifsFromPhotos(photos) {
    return photos.map(p => p.original_size.url)
      .filter(url => url.match(/.gif$/))
  }

  extractGifsFromBody(body) {
    return body.match(/http[^"]*?\.gif/g)
  }

  queueGif() {
    var url = F.sample(1, this.gifs)[0]
    if (!url) return;
    var subbedUrl = url.replace(/^.*\.media\.tumblr\.com/, 'http://djgif.com')
    var image = new Image()
    image.src = subbedUrl
    image.onload = () => {
      this.queuedGifs = F.nub(this.queuedGifs.concat([subbedUrl]))
      console.log(`${this.name} - ${this.queuedGifs.length} queued`)
      Flux.GIF_DOWNLOADED.trigger()
    }
  }

  popGif() {
    return this.queuedGifs.pop()
  }
}

class Tumblrs {
  constructor() {
    this.tumblrs = {}
    Flux.NEW_TUMBLR.listen(this.add.bind(this))
  }

  add(tumblr) {
    if (!this.tumblrs[tumblr]) {
      console.log(`ADDING NEW TUMBLR ${tumblr}`)
      this.tumblrs[tumblr] = new Tumblr(tumblr)
    }
  }

  get all() {
    return Object.keys(this.tumblrs).map(name => this.tumblrs[name])
  }
}

export default new Tumblrs();
