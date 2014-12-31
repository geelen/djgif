import Flux from './flux'

// Kick things off by starting a tumblr and a beat
Flux.CHANNEL_UPDATE.trigger("eightninea", 0);
Flux.CHANNEL_UPDATE.trigger("dvdp", 0);
Flux.CHANNEL_UPDATE.trigger("mrdiv", 0);
Flux.BEAT.trigger(1, 1, 4, 120);

var channel = 0
var beatNote = 65
var barNote = 64
var midiBeats = 1
var midiBars = 1
var prevBeat = performance.now()
navigator.requestMIDIAccess().then((midi) => {
  console.log(midi)
  var input = midi.inputs.values().next().value
  console.log(input)
  if (!input) {
    console.error("No MIDI input detected!")
    return;
  }
  input.addEventListener('midimessage', (message) => {
    if (message.data[0] >> 4 === 9 && //NOTE ON EVENT
        message.data[0] % 16 === channel) //CORRECT CHANNEL
    if (message.data[1] === beatNote) { //CORRECT NOTE
      console.log("BEAT")
      var nowBeat = performance.now(),
        bpmGuess = 60000 / (nowBeat - prevBeat);
      prevBeat = nowBeat;
      console.log(bpmGuess)
      Flux.BEAT.trigger(midiBars, midiBeats++, 4, bpmGuess);
    } else if (message.data[1] === barNote) {
      console.log("BAR")
      midiBars++
      midiBeats = 1
    }
  });
  input.addEventListener('disconnect', (message) => {
    console.log("INPUT DISCONNECTED")
    console.log(message)
    console.log(input)
  })

  midi.addEventListener('disconnect', (message) => {
    console.log("MIDI DISCONNECTED")
    console.log(message)
    console.log(midi)
  })
})
