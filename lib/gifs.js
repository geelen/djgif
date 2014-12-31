import Flux from './flux'
import Tumblrs from './tumblrs'
import F from 'fkit'

class Gifs {
  constructor() {
    Flux.GIFS_AVAILABLE.listen(this.checkBuffer.bind(this))
    Flux.GIF_DOWNLOADED.listen(this.checkBuffer.bind(this))
    Flux.NEXT_GIF.listen(this.checkBuffer.bind(this))
    Flux.NEXT_GIF.listen(this.nextGif.bind(this))
  }

  checkBuffer() {
    Tumblrs.all.forEach(tumblr => {
      if (tumblr.queuedGifs.length < 8) {
        tumblr.queueGif()
      }
    })
  }

  nextGif() {
    console.log("NEXT GIF")
    var withGifs = F.filter(t => t.queuedGifs.length > 0, Tumblrs.all)
    var nextTumblr = F.sample(1, withGifs)[0]
    if (!nextTumblr) return;
    Flux.CHANGE_GIF.trigger(nextTumblr.popGif())
  }
}

export default new Gifs();
