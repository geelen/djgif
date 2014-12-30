import Flux from './flux';
import Tumblrs from './tumblrs';

class Playback {
  constructor() {
    console.log("PLAYBACK")
    Flux.START.listen(this.animate.bind(this))
  }

  animate() {
    //requestAnimationFrame(this.animate.bind(this))
    console.log(".")
  }
}

export default new Playback();
