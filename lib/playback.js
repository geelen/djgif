class Playback {
  constructor() {
    console.log("PLAYBACK")
  }

  start() {
    this.animate()
  }

  animate() {
    //requestAnimationFrame(this.animate.bind(this))
    console.log(".")
  }
}

export default new Playback();
