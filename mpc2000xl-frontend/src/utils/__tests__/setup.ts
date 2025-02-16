export {};

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

  decodeAudioData(_buffer: ArrayBuffer) {
    return Promise.resolve(this.createBuffer());
  }
}

// Make it a module with side effects
(global as any).AudioContext = MockAudioContext;
(global as any).window = {
  AudioContext: MockAudioContext
};
