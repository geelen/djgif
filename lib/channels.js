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
    var nowActive = priority >= 0
    if (this.channels[tumblr].active !== nowActive) {
      console.log(`${tumblr} is now ${nowActive ? 'ACTIVE' : 'DEACTIVATED'}`)
      this.channels[tumblr].active = nowActive
    }
  }
}

export default new Channels();
