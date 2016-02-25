
function AudioVolume(audioElement) {
  this._audioElement = audioElement;
}

AudioVolume.AUDIO_ELEMENT_PROPERTIES = ['volume', 'muted'];

// should this be an event emitter?
AudioVolume.prototype = {
  get level() {
    return this._audioElement.volume * 100;
  },

  set level(val) {
    val = Math.min(100, val);
    this._audioElement.volume = val/100;
    return val;
  },

  get isMuted() {
    return this._audioElement.muted;
  },

  mute() {
    return this._audioElement.muted = true;
  },

  unmute() {
    return this._audioElement.muted = false;
  },

  increase(value = 10) {
    return this.level = Math.min(100, this.value + value);
  },

  decrease(value = 10) {
    return this.level = Math.min(100, this.value - value);
  }
};

export default AudioVolume;
