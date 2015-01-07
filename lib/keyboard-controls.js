import Flux from './flux'

var channelSetting = 0;
var rotateChannels = () => {
  channelSetting++
  Flux.CHANNEL_UPDATE.trigger("mrdiv", channelSetting % 2 - 1);
  Flux.CHANNEL_UPDATE.trigger("patakk", channelSetting % 4 - 2);
}
rotateChannels()

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
