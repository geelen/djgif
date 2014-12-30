import './osc-listener';
import './channels';
import './tumblrs';
import './playback';
import './gifs';
import Flux from './flux';

// Kick things off by starting a tumblr and a beat
Flux.CHANNEL_UPDATE.trigger("mrdiv", 0);
Flux.BEAT.trigger(1, 1, 4, 120);

// Start playback
Flux.GIF_DOWNLOADED.once(() => {
  Flux.NEXT_GIF.trigger()
  Flux.START.trigger()
})

