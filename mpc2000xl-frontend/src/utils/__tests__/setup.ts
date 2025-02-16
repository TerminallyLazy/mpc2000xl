export {};

// Mock Web Audio API
class MockAudioBuffer extends (global as any).AudioBuffer {
  length: number;
  sampleRate: number;
  numberOfChannels: number;
  duration: number;

  constructor(numberOfChannels = 1, length = 44100, sampleRate = 44100) {
    super();
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.sampleRate = sampleRate;
    this.duration = length / sampleRate;
  }

  getChannelData() {
    return new Float32Array(this.length);
  }
}

// Define AudioBuffer if it doesn't exist
if (!(global as any).AudioBuffer) {
  (global as any).AudioBuffer = class AudioBuffer {
    constructor() {}
  };
}

class MockAudioContext {
  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new MockAudioBuffer(numberOfChannels, length, sampleRate);
  }

  decodeAudioData(_buffer: ArrayBuffer) {
    return Promise.resolve(new MockAudioBuffer());
  }

  close() {
    // Mock implementation
    return Promise.resolve();
  }
}

// Make it a module with side effects
(global as any).AudioContext = MockAudioContext;
(global as any).AudioBuffer = MockAudioBuffer;
(global as any).window = {
  AudioContext: MockAudioContext,
  AudioBuffer: MockAudioBuffer
};
