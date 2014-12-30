import Flux from './flux';
import Tumblrs from './tumblrs';

class Playback {
  constructor() {
    console.log("PLAYBACK")
    Flux.START.listen(this.animate.bind(this))
    Flux.CHANGE_GIF.listen(this.changeGif.bind(this))
    this.xGif = document.querySelector('#stage x-gif')
  }

  animate() {
    //requestAnimationFrame(this.animate.bind(this))
    console.log(".")
  }

  changeGif(url) {
    console.log(url)
    console.log(this.xGif)
    this.xGif.setAttribute('src', url)
  }
}

export default new Playback();
