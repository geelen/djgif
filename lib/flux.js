import F from 'fkit';

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
  once(cb) {
    var wrapper = () => {
      cb.apply(null, arguments)
      this._listeners = F.remove(wrapper, this._listeners)
    }
    this.listen(wrapper)
  }
}

var Flux = {
  CHANNEL_UPDATE: new Event(),
  BEAT: new Event(),
  NEW_TUMBLR: new Event(),
  GIFS_AVAILABLE: new Event(),
  GIF_DOWNLOADED: new Event(),
  NEXT_GIF: new Event(),
  CHANGE_GIF: new Event(),
  START: new Event()
};

export default Flux;
