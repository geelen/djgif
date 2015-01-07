import Flux from './flux'
import Tumblrs from './tumblrs'
import Channels from './channels'
import F from 'fkit'

class Gifs {
  constructor() {
    Flux.GIFS_AVAILABLE.listen(this.checkBuffer.bind(this))
    Flux.GIF_DOWNLOADED.listen(this.checkBuffer.bind(this))
    Flux.NEXT_GIF.listen(this.checkBuffer.bind(this))
    Flux.NEXT_GIF.listen(this.nextGif.bind(this))
    setInterval(this.updateBuffers.bind(this), 5000)
    this.needingUpdate = []
  }

  checkBuffer() {
    Tumblrs.all.forEach(tumblr => {
      if (tumblr.queuedGifs.length < 8) {
        this.needingUpdate.push(tumblr.name)
      }
    })
  }

  updateBuffers() {
    console.info("Updating buffers!")
    var toUpdate = F.nub(this.needingUpdate)
    toUpdate.forEach((t) => {
      console.info(`Queing from ${t}`)
      Tumblrs.tumblrs[t].queueGif()
    })
    this.needingUpdate = []
  }

  nextGif() {
    var activeWithGifs = F.filter(t => {
      return t.queuedGifs.length > 0 && Channels.channels[t.name].active
    }, Tumblrs.all)
    var nextTumblr = F.sample(1, activeWithGifs)[0]
    if (!nextTumblr) return;
    console.log(`NEXT GIF from ${nextTumblr.name} (${nextTumblr.queuedGifs.length} queued)`)
    Flux.CHANGE_GIF.trigger(nextTumblr.popGif())
  }
}

export default new Gifs();
