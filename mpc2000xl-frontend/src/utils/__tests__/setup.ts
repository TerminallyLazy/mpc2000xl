// Mock Web Audio API
class MockAudioContext {
  createBuffer() {
    return {
      length: 44100,
      sampleRate: 44100,
      numberOfChannels: 1,
      getChannelData: () => new Float32Array(44100)
    };
  }

  decodeAudioData(buffer: ArrayBuffer) {
    return Promise.resolve(this.createBuffer());
  }
}

declare global {
  var AudioContext: any;
  var window: any;
}

globalThis.AudioContext = MockAudioContext as any;
globalThis.window = {
  AudioContext: MockAudioContext
} as any;
