import Flux from './flux';
import F from 'fkit';

class Channels {
  constructor() {
    console.log("CHANNELS")
    this.channels = {}
    Flux.CHANNEL_UPDATE.listen(this.update.bind(this))
  }

  update(tumblr, priority) {
    if (!this.channels[tumblr]) {
      this.channels[tumblr] = {}
      Flux.NEW_TUMBLR.trigger(tumblr)
    }
    this.channels[tumblr].active = priority >= 0
  }
}

export default new Channels();
