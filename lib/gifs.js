import Flux from './flux';
import Tumblrs from './tumblrs';

class Gifs {
  constructor() {
    Flux.GIFS_AVAILABLE.listen(this.checkBuffer.bind(this))
    Flux.GIF_DOWNLOADED.listen(this.checkBuffer.bind(this))
    Flux.NEXT_GIF.listen(this.nextGif.bind(this))
  }

  checkBuffer() {
    for (let tumblr of Tumblrs) {
      if (tumblr.queuedGifs.length < 8) {
        tumblr.queueGif()
      }
    }
  }

  nextGif() {
    console.log("CHANGE GIF")
  }
}

export default new Gifs();
