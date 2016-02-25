import $    from 'jquery';
import RSVP from 'rsvp';
import AudioVolume from './audio-volume';

function delegateTo$el(method) {
  return function() {
    return this._$audioElement[method](...arguments);
  };
}

function AudioSource(options = {}) {
  var { src, preload, playResolvesOn } = options;
  this._audioElement         = new Audio();
  this._volume               = new AudioVolume(this._audioElement);
  this._audioElement.preload = preload || 'metadata';
  this._audioElement.src     = src || '';
  this._$audioElement        = $(this._audioElement);
  this.playResolvesOn        = playResolvesOn || this.playResolvesOn;
}

AudioSource.prototype = {

  playResolvesOn: 'playing',
  loadResolvesOn: 'canplaythrough',

  get volume() {
    return this._volume;
  },

  set volume(val) {
    return this._volume.level = val;
  },

  get src() {
    return this._audioElement.src;
  },

  get isPlaying() {
    return !this._audioElement.paused;
  },

  get isPaused() {
    return this._audioElement.paused;
  },

  get isMuted() {
    return this.volume.isMuted;
  },

  get buffered() {
    return this._audioElement.buffered;
  },

  get duration() {
    return this._audioElement.duration;
  },

  get type() {
    return this._audioElement.type;
  },

  get currentTime() {
    return this._audioElement.currentTime;
  },

  get srcIsEmpty() {
    var src = this._audioElement.src;
    return src === null || src === undefined || src.length === 0;
  },

  play() {
    if(this.srcIsEmpty) {
      this.pause();
      return RSVP.reject('Could not play src: src is not defined.');
    }

    var playPromise = new RSVP.Promise((resolve, reject) => {
      this.one(`${this.playResolvesOn}._play`, this._onPlay.bind(this, resolve));
      this.one('error._play', this._onPlayError.bind(this, reject));
    });

    this._audioElement.play();
    return playPromise;
  },

  pause() {
    if(this.isPaused) { return RSVP.resolve(); }

    var pausePromise = new RSVP.Promise((resolve, reject) => {
      this.one('pause._pause', this._onPause.bind(this, resolve));
      this.one('error._pause', this._onPauseError.bind(this, reject));
    });

    this._audioElement.pause();
    return pausePromise;
  },

  load() {
    var loadPromise = new RSVP.Promise((resolve, reject) => {
      this.one(`${this.loadResolvesOn}._load`, this._onLoad.bind(this, resolve));
      this.one('error._load', this._onLoadError.bind(this, reject));
    });

    this._audioElement.load();
    return loadPromise;
  },

  speedUp(value)    {},
  slowDownUp(value) {},

  on:      delegateTo$el('on'),
  one:     delegateTo$el('one'),
  off:     delegateTo$el('off'),
  trigger: delegateTo$el('trigger'),

  _onPlay(resolve, evt) {
    this.off('error._play');
    resolve(evt);
  },

  _onPause(resolve, evt) {
    this.off('error._pause');
    resolve(evt);
  },

  _onLoad(resolve, evt) {
    this.off('error._load');
    resolve(evt);
  },

  // jshint unused: false
  _onPlayError(reject, _evt) {
    var src = this.src || 'src is not defined';
    this.off(`${this.playResolvesOn}._play`);
    this.pause();
    reject(new Error(`Could not play src: ${src}.`));
  },

  // jshint unused: false
  _onPauseError(reject, _evt) {
    this.off('pause._pause');
    reject(new Error(`There was an error while pausing src: ${this.src}.`));
  },

  // jshint unused: false
  _onLoadError(reject, _evt) {
    this.off(`${this.loadResolvesOn}._load`);
    reject(new Error(`There was an error while loading src: ${this.src}.`));
  }
};

export default AudioSource;
