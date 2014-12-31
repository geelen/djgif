import Flux from './flux';
import Tumblrs from './tumblrs';

class Playback {
  constructor() {
    Flux.START.listen(this.animate.bind(this))
    Flux.CHANGE_GIF.listen(this.changeGif.bind(this))
    Flux.BEAT.listen(this.onBeat.bind(this))
    this.xGifs = document.querySelectorAll('#stage x-gif')
    this.beatNr = 0
    this.resetBeat()
  }

  resetBeat() {
    this.startTime = performance.now()
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    var beatLength = 60 * 1000 / this.bpm,
      duration = performance.now() - this.startTime,
      beatNr = this.beatNr + Math.floor(duration / beatLength),
      beatFraction = (duration % beatLength) / beatLength;

    [].forEach.call(this.xGifs, (xGif) => {
      xGif.clock(beatNr, beatLength, beatFraction);
    })
  }

  changeGif(url) {
    [].forEach.call(this.xGifs, (xGif) => {
      xGif.setAttribute('src', url)
    })
  }

  onBeat(barNr, beatNr, beatsPerBar, bpm) {
    console.log({barNr, beatNr, beatsPerBar, bpm})
    if (barNr % 2 && beatNr == 1) Flux.NEXT_GIF.trigger()
    this.beatNr++
    this.resetBeat()
    this.bpm = bpm
  }
}

export default new Playback();
