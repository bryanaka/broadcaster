import { module, test, skip } from 'qunit';
import sampleAudio from 'broadcaster/tests/helpers/sample-audio';
import AudioSource from 'broadcaster/business-models/audio-source';

function createFailFn(assert, done) {
  return function fail() {
    assert.ok(false, 'should not be called');
    done();
  }
}

var audioSource = undefined;

module('Unit | Business Model | Audio Source', {
  afterEach() {
    audioSource.pause();
  }
});

test('#play with valid source', function(assert) {
  assert.expect(2);
  var done = assert.async();
  audioSource = new AudioSource({ src: sampleAudio });

  audioSource.play().then(function() {
    assert.ok(audioSource.isPlaying, 'isPlaying is true');
    assert.notOk(audioSource.isPaused,   'isPaused is false');
    done();
  }, createFailFn(assert, done));
});

test('#play with no src', function(assert) {
  assert.expect(2);
  var done = assert.async();
  audioSource = new AudioSource();

  audioSource.play().then(createFailFn(assert, done), function(error) {
    assert.notOk(audioSource.isPlaying, 'isPlaying is false when no src provided');
    assert.ok(audioSource.isPaused,     'isPaused is true when no src provided');
    done();
  });
});

test('#play with bad src', function(assert) {
  assert.expect(2);
  var done = assert.async();
  audioSource = new AudioSource({ src: 'https://localhost:4200/yo.mp3' });

  audioSource.play().then(createFailFn(assert, done), function(error) {
    assert.notOk(audioSource.isPlaying, 'isPlaying is false when bad src provided');
    assert.ok(audioSource.isPaused,   'isPaused is true when bad src provided');
    done();
  });
});

test('#pause with valid src', function(assert) {
  assert.expect(5);
  var done = assert.async();
  audioSource = new AudioSource({ src: sampleAudio });

  assert.ok(audioSource.isPaused, 'isPaused is true by default');

  audioSource.play().then( () => {
    assert.ok(audioSource.isPlaying,   'isPlaying is true');
    assert.notOk(audioSource.isPaused, 'isPaused is false');

    audioSource.pause().then( () => {
      assert.notOk(audioSource.isPlaying, 'isPlaying is false');
      assert.ok(audioSource.isPaused,     'isPaused is true');
      done();
    });
  });
});


test('#pause with no src', function(assert) {
  assert.expect(2);
  var done = assert.async();
  audioSource = new AudioSource();

  audioSource.pause().then(function() {
    assert.notOk(audioSource.isPlaying, 'isPlaying is false when no src provided');
    assert.ok(audioSource.isPaused,     'isPaused is true when no src provided');
    done();
  }, createFailFn(assert, done));
});

test('#pause with bad src', function(assert) {
  assert.expect(2);
  var done = assert.async();
  audioSource = new AudioSource({ src: 'https://localhost:4200/yo.mp3' });

  audioSource.pause().then(function() {
    assert.notOk(audioSource.isPlaying, 'isPlaying is false when bad src provided');
    assert.ok(audioSource.isPaused,   'isPaused is true when bad src provided');
    done();
  }, createFailFn(assert, done));
});
