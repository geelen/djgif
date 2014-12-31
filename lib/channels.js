import Flux from './flux';
import F from 'fkit';

class Channels {
  constructor() {
    this.channels = {}
    Flux.CHANNEL_UPDATE.listen(this.update.bind(this))
  }

  update(tumblr, priority) {
    if (!this.channels[tumblr]) {
      this.channels[tumblr] = {}
      Flux.NEW_TUMBLR.trigger(tumblr)
    }
    this.channels[tumblr].lastSeen = performance.now()
    if (this.removeChannelsAfter) this.removeStaleChannels()
    var nowActive = priority >= 0
    if (this.channels[tumblr].active !== nowActive) {
      console.info(`${tumblr} is now ${nowActive ? 'ACTIVE' : 'DEACTIVATED'}`)
      this.channels[tumblr].active = nowActive
    }
  }

  removeStaleChannels() {
    Object.keys(this.channels).forEach((tumblr) => {
      var t = this.channels[tumblr];
      if (!t.active) return;
      var timeSinceSeen = (performance.now() - t.lastSeen) /1000
      if (timeSinceSeen > this.removeChannelsAfter) {
        console.info(`${tumblr} hasn't been heard from. DEACTIVATING}`)
        t.active = false
      }
    })
  }
}

export default new Channels();
