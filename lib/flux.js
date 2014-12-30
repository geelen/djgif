class Event {
  constructor() {
    this._listeners = [];
  }
  listen(cb) {
    this._listeners.push(cb);
  }
  trigger() {
    this._listeners.forEach(l => l.apply(null, arguments))
  }
}

var Flux = {
  CHANNEL_UPDATE: new Event(),
  BEAT: new Event(),
  NEW_TUMBLR: new Event(),
  GIF_DOWNLOADED: new Event(),
  CHANGE_GIF: new Event()
};

export default Flux;
