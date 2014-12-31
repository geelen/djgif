import './channels'
import './tumblrs'
import './playback'
import './gifs'
//import './keyboard-controls'
import './midi-listener'
//import './osc-listener'
import Flux from './flux'

// Start playback
Flux.GIF_DOWNLOADED.once(() => {
  Flux.NEXT_GIF.trigger()
  Flux.START.trigger()
})
