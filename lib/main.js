import './osc-listener';
import Flux from './flux';

// Kick things off by starting a tumblr and a beat
Flux.CHANNEL_UPDATE.trigger("eightninea", 0);
Flux.BEAT.trigger(1, 1, 4, 120);
