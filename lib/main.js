import './osc-listener';
import './channels';
import './tumblrs';
import './playback';
import './gifs';
import Flux from './flux';

// Kick things off by starting a tumblr and a beat
var channelSetting = 0;
var rotateChannels = () => {
  channelSetting++
  Flux.CHANNEL_UPDATE.trigger("mrdiv", channelSetting % 2 - 1);
  Flux.CHANNEL_UPDATE.trigger("patakk", channelSetting % 4 - 2);
}
rotateChannels()
Flux.BEAT.trigger(1, 1, 4, 120);

// Start playback
Flux.GIF_DOWNLOADED.once(() => {
  Flux.NEXT_GIF.trigger()
  Flux.START.trigger()
})

var beat = 0
document.addEventListener('keydown', (e) => {
  if (e.keyCode == 32) {
    beat++
    Flux.BEAT.trigger(Math.floor(beat / 4) + 1, beat % 4 + 1, 4, 120);
  } else if (e.keyCode == 39) {
    rotateChannels()
  } else {
    console.log(e.keyCode)
  }
})
