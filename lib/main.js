import './osc-listener';
import './channels';
import './tumblrs';
import './playback';
import './gifs';
import Flux from './flux';

// Kick things off by starting a tumblr and a beat
Flux.CHANNEL_UPDATE.trigger("simpsonsgifs", 0);
Flux.BEAT.trigger(1, 1, 4, 120);

// Start playback
Flux.GIF_DOWNLOADED.once(() => {
  Flux.NEXT_GIF.trigger()
  Flux.START.trigger()
})

var beat = 0
document.addEventListener('keydown', (e) => {
  if (e.keyCode != 32) return
  beat++
  Flux.BEAT.trigger(Math.floor(beat / 4) + 1, beat % 4 + 1, 4, 120);
})
