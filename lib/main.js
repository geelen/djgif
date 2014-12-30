import './osc-listener';
import './channels';
import './tumblrs';
import Flux from './flux';
import Playback from './playback';

// Kick things off by starting a tumblr and a beat
Flux.CHANNEL_UPDATE.trigger("eightninea", 0);
Flux.BEAT.trigger(1, 1, 4, 120);

Playback.start();
